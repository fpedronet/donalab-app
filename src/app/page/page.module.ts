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
import { Not404Component } from './configuracion/not404/not404.component';
import { Not403Component } from './configuracion/not403/not403.component';
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
import { LdonacionComponent } from './donante/donacion/ldonacion/ldonacion.component';
import { CdonacionComponent } from './donante/donacion/cdonacion/cdonacion.component';
import { RptetiquetaComponent } from './reporte/rptetiqueta/rptetiqueta.component';
import { RptdonanteComponent } from './reporte/rptdonante/rptdonante.component';
import { RptfichaComponent } from './reporte/rptficha/rptficha.component';

import { MdiferidoComponent } from './donante/entrevista/mdiferido/mdiferido.component';
import { McodigobarraComponent } from './donante/donacion/mcodigobarra/mcodigobarra.component';
import { MchequeoComponent } from './donante/chequeo/mchequeo/mchequeo.component';
import { LsolicitudComponent } from './paciente/solicitud/lsolicitud/lsolicitud.component';
import { CsolicitudComponent } from './paciente/solicitud/csolicitud/csolicitud.component';
import { CconfirmacionComponent } from './paciente/confirmacion/cconfirmacion/cconfirmacion.component';
import { FsolicitudComponent } from './paciente/solicitud/fsolicitud/fsolicitud.component';

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
    CentrevistaComponent,
    LdonacionComponent,
    CdonacionComponent,
    RptetiquetaComponent,
    RptdonanteComponent,
    RptfichaComponent,
    MdiferidoComponent,
    McodigobarraComponent,
    MchequeoComponent,
    LsolicitudComponent,
    CsolicitudComponent,
    CconfirmacionComponent,
    FsolicitudComponent
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
