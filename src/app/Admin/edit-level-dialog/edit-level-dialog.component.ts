import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelDTO } from 'src/app/Service/course.service';

@Component({
  selector: 'app-edit-level-dialog',
  templateUrl: './edit-level-dialog.component.html',
  styleUrls: ['./edit-level-dialog.component.css']
})
export class EditLevelDialogComponent implements OnInit {
  levelForm!: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<EditLevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { level: LevelDTO },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.levelForm = this.fb.group({
      name: [this.data.level.name, [Validators.required, Validators.maxLength(50)]],
      description: [this.data.level.description, Validators.maxLength(200)]
    });
  }

  onSave(): void {
    if (this.levelForm.valid) {
      const updatedLevel: LevelDTO = {
        ...this.data.level,
        ...this.levelForm.value
      };
      this.dialogRef.close(updatedLevel);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}