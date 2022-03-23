import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { ConfirmComponent } from './component/confirm/confirm.component';
import { LayoutComponent } from './component/layout/layout.component';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { PageRoutingModule } from './page-routing.module';
import { InterceptorService } from '../_interceptors/interceptor.service';
import { Not404Component } from './not404/not404.component';
import { Not403Component } from './not403/not403.component';
import { LpostulanteComponent } from './postulante/lpostulante/lpostulante.component';
import { CpostulanteComponent } from './postulante/cpostulante/cpostulante.component';

@NgModule({
  declarations: [
    ConfirmComponent,
    LayoutComponent,
    InicioComponent,
    Not404Component,
    Not403Component,
    LpostulanteComponent,
    CpostulanteComponent,
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
