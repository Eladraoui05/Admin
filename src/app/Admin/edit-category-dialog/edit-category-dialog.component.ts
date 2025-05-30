import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryDTO, CourseService } from 'src/app/Service/course.service';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})
export class EditCategoryDialogComponent implements OnInit {
  categoryForm: FormGroup;
  isUpdating = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: { category: CategoryDTO }
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    if (this.data?.category) {
      this.categoryForm.patchValue({
        categoryName: this.data.category.categoryName
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.isUpdating = true;
    this.errorMessage = null;

    const updatedCategory: CategoryDTO = {
      id: this.data.category.id,
      categoryName: this.categoryForm.value.categoryName,
      imageCategory: this.data.category.imageCategory
    };

    this.courseService.updateCategory(updatedCategory.id, updatedCategory).subscribe({
      next: (response) => {
        this.isUpdating = false;
        this.dialogRef.close(response);
      },
      error: (error) => {
        this.isUpdating = false;
        this.errorMessage = error.message || 'Erreur lors de la mise à jour de la catégorie';
        console.error('Update error:', error);
      }
    });
  }
}