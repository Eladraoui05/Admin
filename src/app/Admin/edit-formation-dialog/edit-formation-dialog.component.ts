import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseDTO, CourseService, CategoryDTO, LevelDTO, InstructorDTO } from 'src/app/Service/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-formation-dialog',
  templateUrl: './edit-formation-dialog.component.html',
  styleUrls: ['./edit-formation-dialog.component.css']
})
export class EditFormationDialogComponent implements OnInit {
  editForm: FormGroup;
  categories: CategoryDTO[] = [];
  levels: LevelDTO[] = [];
  instructors: InstructorDTO[] = [];
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isImageChanged = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditFormationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { course: CourseDTO }
  ) {
    this.editForm = this.fb.group({
      courseName: ['', Validators.required],
      courseDescription: ['', Validators.required],
      levelId: ['', Validators.required],
      categoryId: ['', Validators.required],
      userId: ['', Validators.required], 
      duration: [''],
      imageCourse: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadLevels();
    this.loadInstructors();
    this.initForm();
  }

initForm(): void {
  const course = this.data.course;
  this.previewUrl = course.imageCourse || 'assets/images/default-course.jpg';
  
  this.editForm.patchValue({
    courseName: course.courseName,
    courseDescription: course.courseDescription,
    levelId: this.levels.find(l => l.name === course.level)?.id,
    categoryId: this.categories.find(c => c.categoryName === course.category)?.id,
    userId: course.userId,
    duration: course.duration
  });
}

  loadCategories(): void {
    this.courseService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.initForm();
      },
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadLevels(): void {
    this.courseService.getAllLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
        this.initForm();
      },
      error: (err) => console.error('Error loading levels:', err)
    });
  }

  loadInstructors(): void {
    this.courseService.getAllInstructors().subscribe({
      next: (instructors) => {
        this.instructors = instructors;
      },
      error: (err) => console.error('Error loading instructors:', err)
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isImageChanged = true;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

onSubmit(): void {
  if (this.editForm.valid) {
    const formValues = this.editForm.value;
    
    // Créez l'objet qui correspond à UpdateCourseDTO attendu par le backend
    const updateData = {
      courseName: formValues.courseName,
      courseDescription: formValues.courseDescription,
      levelId: formValues.levelId,
      categoryId: formValues.categoryId,
      userId: formValues.userId, // Assurez-vous que c'est le bon champ
      duration: formValues.duration || '',
      imageCourse: this.data.course.imageCourse // Conservez l'image existante par défaut
    };

    // Si une nouvelle image est sélectionnée, ajoutez-la
    if (this.isImageChanged && this.selectedFile) {
      // Ici vous devrez peut-être convertir l'image en base64 ou autre selon ce que le backend attend
      // Cette partie dépend de comment votre backend gère les images
      // Par exemple :
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        updateData.imageCourse = reader.result as string;
        this.dialogRef.close(updateData);
      };
    } else {
      this.dialogRef.close(updateData);
    }
  } else {
    this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', {
      duration: 3000
    });
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }

  displayInstructor(instructor: InstructorDTO): string {
    return instructor ? `${instructor.user.firstName} ${instructor.user.lastName}` : '';
  }
}