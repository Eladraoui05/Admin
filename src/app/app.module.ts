import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftSidebarComponent } from './Admin/left-sidebar/left-sidebar.component';
import { SidebarComponent } from './Admin/sidebar/sidebar.component';
import { NavbarComponent } from './Admin/navbar/navbar.component';
import { UtulisateurComponent } from './Admin/utulisateur/utulisateur.component';
import { StatistiqueComponent } from './Admin/statistique/statistique.component';
import { ParametreComponent } from './Admin/parametre/parametre.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { FormationsListComponent } from './Admin/formations-list/formations-list.component';
import { AddFormationDialogComponent } from './Admin/add-formation-dialog/add-formation-dialog.component';
import { EditFormationDialogComponent } from './Admin/edit-formation-dialog/edit-formation-dialog.component';
import { ConfirmDialogComponent } from './Admin/confirm-dialog/confirm-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { AddCategoryDialogComponent } from './Admin/add-category-dialog/add-category-dialog.component';
import { EditCategoryDialogComponent } from './Admin/edit-category-dialog/edit-category-dialog.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditLevelDialogComponent } from './Admin/edit-level-dialog/edit-level-dialog.component';
import { AddLevelDialogComponent } from './Admin/add-level-dialog/add-level-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { EditLessonDialogComponent } from './Admin/edit-lesson-dialog/edit-lesson-dialog.component';
import { AddLessonDialogComponent } from './Admin/add-lesson-dialog/add-lesson-dialog.component';


import { LessonsListComponent } from './Admin/lessons-list/lessons-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftSidebarComponent,
    SidebarComponent,
    NavbarComponent,
    UtulisateurComponent,
    StatistiqueComponent,
    ParametreComponent,
    DashboardComponent,
    FormationsListComponent,
    AddFormationDialogComponent,
    EditFormationDialogComponent,
    ConfirmDialogComponent,
    AddCategoryDialogComponent,
    EditCategoryDialogComponent,
    EditLevelDialogComponent,
    AddLevelDialogComponent,
    EditLessonDialogComponent,
    AddLessonDialogComponent,
      LessonsListComponent,
  ],
  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSelectModule,
    MatOptionModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }