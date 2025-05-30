import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService, LevelDTO, InstructorDTO, CategoryDTO } from 'src/app/Service/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-formation-dialog',
  templateUrl: './add-formation-dialog.component.html',
  styleUrls: ['./add-formation-dialog.component.css']
})
export class AddFormationDialogComponent implements OnInit {
  courseForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  levels: LevelDTO[] = [];
  categories: CategoryDTO[] = [];
  instructors: InstructorDTO[] = [];
  isSubmitting = false;
  isLoadingInstructors = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddFormationDialogComponent>,
    private courseService: CourseService,
     private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.maxLength(100)]],
      courseDescription: ['', [Validators.required, Validators.maxLength(500)]],
      levelId: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^\d+h(\d{2})?$/)]],
      categoryId: ['', Validators.required],
      userId: ['', Validators.required],
      imageCourse: ['', Validators.required]
    });
    
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadLevels();
    this.loadInstructors();
  }

  loadCategories(): void {
    this.courseService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  loadLevels(): void {
    this.courseService.getAllLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
      },
      error: (err) => {
        console.error('Error fetching levels:', err);
      }
    });
  }

  loadInstructors(): void {
    this.isLoadingInstructors = true;
    this.courseService.getAllInstructors().subscribe({
      next: (instructors) => {
        console.log('Instructors loaded:', instructors);
        this.instructors = instructors;
        this.isLoadingInstructors = false;
      },
      error: (err) => {
        console.error('Error fetching instructors:', err);
        this.isLoadingInstructors = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
  
        
        this.courseForm.patchValue({ imageCourse: reader.result as string });
      };
      reader.readAsDataURL(file); 
    }
  }
  
onSubmit(): void {
  if (this.courseForm.valid && !this.isSubmitting) {
    this.isSubmitting = true;
    
    const formData = {
      ...this.courseForm.value,
      imageCourse: this.previewUrl as string
    };

    this.courseService.createCourse(formData).subscribe({
      next: (createdCourse) => {
        this.dialogRef.close(createdCourse); 
      },
      error: (err) => {
        console.error('Error creating course:', err);
        this.snackBar.open('Erreur lors de la création de la formation', 'Fermer', {
          duration: 3000
        });
        this.isSubmitting = false;
      }
    });
  }
}
  

  onCancel(): void {
    this.dialogRef.close();
  }

  getInstructorDisplayName(instructor: InstructorDTO): string {
    if (!instructor) return 'Inconnu';
    return `${instructor.user.firstName || ''} ${instructor.user.lastName || ''}`.trim() || 'Inconnu';
  }
}