import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService, CategoryDTO } from 'src/app/Service/course.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent {
  categoryForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private dialogRef: MatDialogRef<AddCategoryDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    this.isLoading = true;
    const categoryData: CategoryDTO = {
      id: 0,
      categoryName: this.categoryForm.value.categoryName,
      imageCategory: '' 
    };
    

    this.courseService.createCategory(categoryData).subscribe({
      next: () => {
        this.snackBar.open('Catégorie ajoutée avec succès!', 'Fermer', {
          duration: 3000
        });
        this.dialogRef.close(true); 
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la catégorie:', err);
        this.snackBar.open('Erreur lors de l\'ajout de la catégorie', 'Fermer', {
          duration: 3000
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}