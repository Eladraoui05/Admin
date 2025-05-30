import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonsListComponent } from './Admin/lessons-list/lessons-list.component';
import { UtulisateurComponent } from './Admin/utulisateur/utulisateur.component';
import { FormationsListComponent } from './Admin/formations-list/formations-list.component';
import { ParametreComponent } from './Admin/parametre/parametre.component';
import { StatistiqueComponent } from './Admin/statistique/statistique.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';

const routes: Routes = [
  {path:"dashboard",component:DashboardComponent},
  {path:"utulisateur",component:UtulisateurComponent},
  {path:"formation",component:FormationsListComponent},
  {path:"parametre",component:ParametreComponent},
  {path:"statistique",component:StatistiqueComponent},
  {path:"lesson",component:LessonsListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
