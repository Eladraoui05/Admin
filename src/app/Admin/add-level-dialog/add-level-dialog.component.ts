import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateLevelDTO, LevelDTO } from 'src/app/Service/course.service';

@Component({
  selector: 'app-add-level-dialog',
  templateUrl: './add-level-dialog.component.html',
  styleUrls: ['./add-level-dialog.component.css']
})
export class AddLevelDialogComponent implements OnInit {
  levelForm!: FormGroup;


  
  constructor(
    public dialogRef: MatDialogRef<AddLevelDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.levelForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      
    });


  }

  onAdd(): void {
    if (this.levelForm.valid) {
      const newLevel: CreateLevelDTO = {
        name: this.levelForm.value.name
      };
      this.dialogRef.close(newLevel);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

