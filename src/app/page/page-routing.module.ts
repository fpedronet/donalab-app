import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { InicioComponent } from './inicio/inicio.component';

import { Not403Component } from './not403/not403.component';

import { CpostulanteComponent } from './postulante/cpostulante/cpostulante.component';
import { LpostulanteComponent } from './postulante/lpostulante/lpostulante.component';

const routes: Routes = [
  // {path:'inicio', component: InicioComponent, canActivate: [GuardService]},
  {path:'inicio', component: InicioComponent, canActivate: [GuardService]},

  {path: 'not-403', component: Not403Component},

  {path:'postulante', component: LpostulanteComponent, canActivate: [GuardService]},
  {path:'postulante/create', component: CpostulanteComponent, canActivate: [GuardService]},
  {path:'postulante/edit/:id', component: CpostulanteComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
