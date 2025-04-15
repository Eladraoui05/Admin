import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormateurComponent } from './formateur/formateur.component';
import { UtulisateurComponent } from './utulisateur/utulisateur.component';
import { FormationComponent } from './formation/formation.component';
import { ParametreComponent } from './parametre/parametre.component';
import { StatistiqueComponent } from './statistique/statistique.component';

const routes: Routes = [
  {path:"formateur",component:FormateurComponent},
  {path:"utulisateur",component:UtulisateurComponent},
  {path:"formation",component:FormationComponent},
  {path:"parametre",component:ParametreComponent},
  {path:"statistique",component:StatistiqueComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
