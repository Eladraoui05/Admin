import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LessonService } from 'src/app/Service/lesson.service';
import { CourseService, CourseDTO } from 'src/app/Service/course.service';
import { AddLessonDialogComponent } from '../add-lesson-dialog/add-lesson-dialog.component';
import { EditLessonDialogComponent } from '../edit-lesson-dialog/edit-lesson-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lessons-list',
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.css'],
})
export class LessonsListComponent implements OnInit {
  searchQuery: string = '';
  courseFilter = new FormControl<number | null>(null);
  lessons: any[] = [];
  filteredLessons: any[] = [];
  courses: CourseDTO[] = [];
  isLoading: boolean = true;
  isSaving = false;

  constructor(
    private dialog: MatDialog,
    private lessonService: LessonService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadLessons();
    this.loadCourses();

    this.courseFilter.valueChanges.subscribe(() => {
      this.filterLessons();
    });
  }

  loadLessons(): void {
    this.isLoading = true;
    this.lessonService.getAllLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons.map((lesson) => ({
          ...lesson,
          courseName: lesson.courseName,
        }));
        this.filteredLessons = [...this.lessons];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading lessons:', err);
        this.isLoading = false;
      },
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
      },
    });
  }

filterLessons(): void {
  let result = [...this.lessons];

  if (this.searchQuery) {
    const query = this.searchQuery.toLowerCase();
    result = result.filter(l =>
      l.titre.toLowerCase().includes(query) ||
      (l.description && l.description.toLowerCase().includes(query))
    );
  }

      if (this.courseFilter.value !== null) {
      result = result.filter((l) => l.courseName === this.courseFilter.value);
      console.log(result);
    }

    this.filteredLessons = result;
}


  getCourseName(courseId: number): string {
    const course = this.courses.find((c) => c.id === courseId);
    return course ? course.courseName : 'Non assigné';
  }

  formatDuration(duration: string): string {
    if (!duration) return 'Non spécifiée';

    // If duration is in HH:MM:SS format
    if (/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
      return duration;
    }

    // If duration is in seconds
    if (/^\d+$/.test(duration)) {
      const seconds = parseInt(duration);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    return duration;
  }

  getSafeVideoUrl(url: string): SafeResourceUrl {
    if (!url) return this.sanitizer.bypassSecurityTrustResourceUrl('');

    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';

      if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }

      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      }
    }

    // Handle other video URLs
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  openAddLessonDialog(): void {
    const dialogRef = this.dialog.open(AddLessonDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { courses: this.courses },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.lessonService.addLesson(result).subscribe({
          next: () => this.loadLessons(),
          error: (err) =>
            console.error("Erreur lors de l'ajout de la leçon:", err),
        });
      }
    });
  }

openEditLessonDialog(lesson: any, event: Event): void {
  event.stopPropagation();

  const dialogRef = this.dialog.open(EditLessonDialogComponent, {
    width: '600px',
    data: {
      lesson: {
        ...lesson,
        lessonId: lesson.lessonId,
      },
      courses: this.courses,
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result?.success) {
      // Mettre à jour la leçon dans la liste localement
      const index = this.lessons.findIndex(l => l.lessonId === lesson.lessonId);
      if (index !== -1) {
        this.lessons[index] = {
          ...this.lessons[index],
          ...result.updatedLesson,
          courseName: this.getCourseName(result.updatedLesson.courseId)
        };
        this.filterLessons(); // Appliquer les filtres actuels
      }
    }
  });
}
deleteLesson(id: number, event: Event): void {
  event.stopPropagation();

  if (!id) {
    console.error('ID invalide');
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: {
      title: 'Confirmer',
      message: 'Voulez-vous vraiment supprimer cette leçon?',
      cancelText: 'Anuller',
      confirmText: 'Supprimer',
    },
  });

  dialogRef.afterClosed().subscribe((confirm) => {
    if (confirm) {
      this.lessonService.deleteLesson(id).subscribe({
        next: () => {
          this.snackBar.open('Leçon supprimée avec succès', 'Fermer', {
            duration: 2000,
          });
          
          this.lessons = this.lessons.filter(l => l.lessonId !== id);
          this.filterLessons();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        },
      });
    }
  });
}
}
