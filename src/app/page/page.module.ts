import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { LayoutComponent } from './component/layout/layout.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PageRoutingModule } from './page-routing.module';
import { InterceptorService } from '../_interceptors/interceptor.service';
import { Not404Component } from './not404/not404.component';
import { Not403Component } from './not403/not403.component';
import { LaspiranteComponent } from './donante/aspirante/laspirante/laspirante.component';
import { CaspiranteComponent } from './donante/aspirante/caspirante/caspirante.component';
import { LaspiranteligthComponent } from './donante/aspiranteligth/laspiranteligth/laspiranteligth.component';
import { CaspiranteligthComponent } from './donante/aspiranteligth/caspiranteligth/caspiranteligth.component';
import { MfaspirantelingthComponent } from './donante/aspiranteligth/mfaspirantelingth/mfaspirantelingth.component';
import { MfaspiranteComponent } from './donante/aspirante/mfaspirante/mfaspirante.component';
import { CchequeoComponent } from './donante/chequeo/cchequeo/cchequeo.component';
import { LchequeoComponent } from './donante/chequeo/lchequeo/lchequeo.component';
import { LentrevistaComponent } from './donante/entrevista/lentrevista/lentrevista.component';
import { CentrevistaComponent } from './donante/entrevista/centrevista/centrevista.component';

@NgModule({
  declarations: [
    ConfirmComponent,
    LayoutComponent,
    HomeComponent,
    Not404Component,
    Not403Component,
    LaspiranteComponent,
    CaspiranteComponent,
    LaspiranteligthComponent,
    CaspiranteligthComponent,
    MfaspirantelingthComponent,
    MfaspiranteComponent,
    CchequeoComponent,
    LchequeoComponent,
    LentrevistaComponent,
    CentrevistaComponent   
  ],
  imports: [
    MaterialModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    PageRoutingModule
  ],
  providers: [
    {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true,
  },
  {
    provide:LocationStrategy,
    useClass:HashLocationStrategy
  }
],
})
export class PageModule { }
