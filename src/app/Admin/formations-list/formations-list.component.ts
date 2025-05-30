import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddFormationDialogComponent } from '../add-formation-dialog/add-formation-dialog.component';
import { CourseDTO, CourseService, CategoryDTO, LevelDTO } from 'src/app/Service/course.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditFormationDialogComponent } from '../edit-formation-dialog/edit-formation-dialog.component';
import { AddCategoryDialogComponent } from '../add-category-dialog/add-category-dialog.component';
import { EditCategoryDialogComponent } from '../edit-category-dialog/edit-category-dialog.component';
import { AddLevelDialogComponent } from '../add-level-dialog/add-level-dialog.component';
import { EditLevelDialogComponent } from '../edit-level-dialog/edit-level-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-formations-list',
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.css']
})
export class FormationsListComponent implements OnInit {
  searchQuery: string = '';
  categoryFilter = new FormControl<string | null>(null);
  levelFilter = new FormControl<string | null>(null);
  courses: CourseDTO[] = [];
  filteredCourses: CourseDTO[] = [];
  categories: CategoryDTO[] = [];
  levels: LevelDTO[] = [];
  isLoading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private courseService: CourseService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadCategories();
    this.loadLevels();
    
    this.categoryFilter.valueChanges.subscribe(() => {
      this.filterCourses();
    });
    
    this.levelFilter.valueChanges.subscribe(() => {
      this.filterCourses();
    });
  }

  loadCourses(): void {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Courses data:', courses);
        this.filteredCourses = [...courses];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des cours:', err);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.courseService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des catégories:', err);
      }
    });
  }

  loadLevels(): void {
    this.courseService.getAllLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des niveaux:', err);
      }
    });
  }

  filterCourses(): void {
    let result = [...this.courses];
    
    // Filtre par recherche textuelle
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.courseName.toLowerCase().includes(query) ||
        c.courseDescription.toLowerCase().includes(query)
      );
    }
    
    // Filtre par catégorie
    if (this.categoryFilter.value !== null) {
      result = result.filter(c => c.category?.toString() === this.categoryFilter.value);
    }
    
    // Filtre par niveau
    if (this.levelFilter.value !== null) {
      result = result.filter(c => c.level?.toString() === this.levelFilter.value);
    }
    
    this.filteredCourses = result;
  }

// Modifiez la méthode openAddFormationDialog
openAddFormationDialog(): void {
  const dialogRef = this.dialog.open(AddFormationDialogComponent, {
    width: '600px',
    panelClass: 'custom-dialog-container'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.courseService.createCourse(result).subscribe({
        next: (newCourse) => {
          // Ajoute le nouveau cours à la liste sans recharger toute la page
          this.courses.unshift(newCourse);
          this.filterCourses();
          this.snackBar.open('Formation ajoutée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du cours:', err);
          this.snackBar.open('Erreur lors de l\'ajout de la formation', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  });
}

// Modifiez la méthode deleteCourse
deleteCourse(id: number): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '400px',
    data: { 
      title: 'Confirmer la suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cette formation ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler'
    }
  });

dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          // Supprime le cours de la liste sans recharger toute la page
          this.courses = this.courses.filter(c => c.id !== id);
          this.filterCourses();
          this.snackBar.open('Formation supprimée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  });
}



  openEditFormationDialog(course: CourseDTO): void {
    const dialogRef = this.dialog.open(EditFormationDialogComponent, {
      width: '600px',
      panelClass: 'custom-dialog-container',
      data: { course }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.updateCourse(course.id, result).subscribe({
          next: () => this.loadCourses(),
          error: (err) => console.error('Erreur lors de la mise à jour du cours:', err)
        });
      }
    });
  }

  openAddCategoryDialog(event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.createCategory(result).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error('Erreur lors de l\'ajout de la catégorie:', err)
        });
      }
    });
  }

  openEditCategoryDialog(category: CategoryDTO, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      width: '400px',
      data: { category }
    });
  
    dialogRef.afterClosed().subscribe((updatedCategory: CategoryDTO) => {
      if (updatedCategory) {
        this.courseService.updateCategory(updatedCategory.id, updatedCategory).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error('Erreur lors de la mise à jour de la catégorie:', err)
        });
      }
    });
  }

  deleteCategory(category: CategoryDTO, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer la catégorie "${category.categoryName}" ?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteCategory(category.id).subscribe({
          next: () => this.loadCategories(),
          error: (err) => console.error('Erreur lors de la suppression de la catégorie:', err)
        });
      }
    });
  }

  openAddLevelDialog(event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(AddLevelDialogComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe((newLevel: LevelDTO) => {
      if (newLevel) {
        this.courseService.createLevel(newLevel).subscribe({
          next: () => this.loadLevels(),
          error: (err) => console.error('Erreur lors de l\'ajout du niveau:', err)
        });
      }
    });
  }

  openEditLevelDialog(level: LevelDTO, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(EditLevelDialogComponent, {
      width: '400px',
      data: { level }
    });
  
    dialogRef.afterClosed().subscribe((updatedLevel: LevelDTO) => {
      if (updatedLevel) {
        this.courseService.updateLevel(updatedLevel.id, updatedLevel).subscribe({
          next: () => this.loadLevels(),
          error: (err) => console.error('Erreur lors de la mise à jour du niveau:', err)
        });
      }
    });
  }

  deleteLevel(level: LevelDTO, event: Event): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer le niveau "${level.name}" ?` 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.courseService.deleteLevel(level.id).subscribe({
          next: () => this.loadLevels(),
          error: (err) => console.error('Erreur lors de la suppression du niveau:', err)
        });
      }
    });
  }

  handleImageError(event: any): void {
    event.target.src = 'assets/images/default-course.jpg';
  }
}