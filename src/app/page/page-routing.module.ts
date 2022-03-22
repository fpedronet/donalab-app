import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { InicioComponent } from './inicio/inicio.component';

import { Not403Component } from './not403/not403.component';

const routes: Routes = [
  {path:'inicio', component: InicioComponent, canActivate: [GuardService]},

  {path: 'not-403', component: Not403Component},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
