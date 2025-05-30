import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseDTO } from 'src/app/Service/course.service';
import { LessonService } from 'src/app/Service/lesson.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-lesson-dialog',
  templateUrl: './edit-lesson-dialog.component.html',
  styleUrls: ['./edit-lesson-dialog.component.css'],
})
export class EditLessonDialogComponent implements OnInit {
  lessonForm: FormGroup;
  courses: CourseDTO[];
  lessons: any[] = [];
  isSaving = false;
    isLoading: boolean = true;


  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      lesson: any;
      courses: CourseDTO[];
    }
  ) {
    this.courses = data.courses;
    this.lessonForm = this.fb.group({
      lessonId: [''],
      titre: ['', [Validators.required]],
      description: [''],
      URL: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      courseId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  loadLessons(): void {
    this.isLoading = true;
    this.lessonService.getAllLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons.map((lesson) => ({
          ...lesson,
          courseName: lesson.courseName,
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.isLoading = false;
      },
    });
  }

  initForm(): void {
    // Normalisation des données
    const lessonData = {
      lessonId: this.data.lesson.lessonId,
      titre: this.data.lesson.titre || '',
      description: this.data.lesson.description || '',
      URL: this.data.lesson.URL || this.data.lesson.url || '',
      duration: this.formatDurationForEdit(this.data.lesson.duration),
      courseId: this.getCourseId(this.data.lesson),
    };

    // Initialisation du formulaire
    this.lessonForm.patchValue({
      lessonId: lessonData.lessonId,
      titre: lessonData.titre,
      description: lessonData.description,
      URL: lessonData.URL,
      duration: lessonData.duration,
      courseId: lessonData.courseId,
    });
  }

  // Méthode pour extraire le courseId correctement
  private getCourseId(lesson: any): number | null {
    if (lesson.courseId) return lesson.courseId;
    if (lesson.course && lesson.course.id) return lesson.course.id;
    if (lesson.courseName) {
      const course = this.courses.find(
        (c) => c.courseName === lesson.courseName
      );
      return course ? course.id : null;
    }
    return null;
  }

  formatDurationForEdit(duration: any): string {
    if (!duration) return '00:00';

    if (typeof duration === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(duration)) {
      return duration;
    }

    const seconds = parseInt(duration);
    if (!isNaN(seconds)) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    }

    return '00:00';
  }

onSubmit(): void {
  this.isSaving = true;
  const formData = this.prepareFormData();

  if (!this.data.lesson?.lessonId) {
    this.handleError('ID de leçon manquant');
    return;
  }

  this.lessonService
    .updateLesson(this.data.lesson.lessonId, formData)
    .subscribe({
      next: (updatedLesson) => {
        this.handleSuccess();
        // Retourne les données mises à jour
        this.dialogRef.close({success: true, updatedLesson});
      },
      error: (err) => this.handleError(err),
    });
}

  private prepareFormData(): any {
    const formValue = this.lessonForm.value;

    // if (formValue.duration.includes(':')) {
    //   const parts = formValue.duration.split(':');
    //   formValue.duration = (+parts[0] * 3600) + (+parts[1] * 60) + (+parts[2]);
    // }

    return {
      ...formValue,
      lessonId: this.data.lesson.lessonId,
    };
  }

  private handleSuccess(): void {
    this.snackBar.open('Leçon modifiée avec succès', 'Fermer', {
      duration: 2000,
    });
    this.dialogRef.close(true);
    this.isSaving = false;
  }

  private handleError(error: any): void {
    console.error('Erreur:', error);
    const errorMsg =
      typeof error === 'string' ? error : error.message || 'Erreur inconnue';
    this.snackBar.open(`Erreur: ${errorMsg}`, 'Fermer', { duration: 5000 });
    this.isSaving = false;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
