import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseDTO } from 'src/app/Service/course.service';
import { LessonService } from 'src/app/Service/lesson.service';

@Component({
  selector: 'app-add-lesson-dialog',
  templateUrl: './add-lesson-dialog.component.html',
  styleUrls: ['./add-lesson-dialog.component.css']
})
export class AddLessonDialogComponent implements OnInit {
  lessonForm !: FormGroup;
  courses: CourseDTO[];

  constructor(
    private fb: FormBuilder,
    private lessonService: LessonService,
    public dialogRef: MatDialogRef<AddLessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courses: CourseDTO[] }
  ) {
    this.courses = data.courses;
  }

  ngOnInit(): void {
    this.lessonForm = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      URL: ['', Validators.required],
      duration: ['', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.lessonForm.valid) {
      this.dialogRef.close(this.lessonForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}