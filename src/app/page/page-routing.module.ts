import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardService } from '../_service/guard.service';

import { CaspiranteComponent } from './donante/aspirante/caspirante/caspirante.component';
import { LaspiranteComponent } from './donante/aspirante/laspirante/laspirante.component';
import { CaspiranteligthComponent } from './donante/aspiranteligth/caspiranteligth/caspiranteligth.component';
import { LaspiranteligthComponent } from './donante/aspiranteligth/laspiranteligth/laspiranteligth.component';



import { HomeComponent } from './home/home.component';

import { Not403Component } from './not403/not403.component';

const routes: Routes = [
  {path:'home', component: HomeComponent, canActivate: [GuardService]},

  {path: 'not-403', component: Not403Component},

  {path:'donante/aspirante', component: LaspiranteComponent, canActivate: [GuardService]},
  {path:'donante/aspirante/create', component: CaspiranteComponent, canActivate: [GuardService]},
  {path:'donante/aspirante/edit/:id', component: CaspiranteComponent, canActivate: [GuardService]},

  {path:'donante/aspirantelight', component: LaspiranteligthComponent, canActivate: [GuardService]},
  {path:'donante/aspirantelight/create', component: CaspiranteligthComponent, canActivate: [GuardService]},
  {path:'donante/aspirantelight/edit/:id/:edit', component: CaspiranteligthComponent, canActivate: [GuardService]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
