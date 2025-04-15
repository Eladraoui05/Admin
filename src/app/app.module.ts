import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';
import { FormateurComponent } from './formateur/formateur.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FormationComponent } from './formation/formation.component';
import { UtulisateurComponent } from './utulisateur/utulisateur.component';
import { StatistiqueComponent } from './statistique/statistique.component';
import { ParametreComponent } from './parametre/parametre.component';

@NgModule({
  declarations: [
    AppComponent,
    LeftSidebarComponent,
    FormateurComponent,
    SidebarComponent,
    NavbarComponent,
    FormationComponent,
    UtulisateurComponent,
    StatistiqueComponent,
    ParametreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
