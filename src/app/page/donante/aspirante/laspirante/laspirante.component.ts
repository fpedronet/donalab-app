import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { PredonanteService } from 'src/app/_service/predonante.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { Permiso } from 'src/app/_model/permiso';
import { MatDialog } from '@angular/material/dialog';

import { MfaspiranteComponent } from '../mfaspirante/mfaspirante.component';
import { Predonante, PredonanteRequest } from 'src/app/_model/predonante';
import forms from 'src/assets/json/formulario.json';


@Component({
  selector: 'app-laspirante',
  templateUrl: './laspirante.component.html',
  styleUrls: ['./laspirante.component.css']
})
export class LaspiranteComponent implements OnInit {

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['codigo', 'nombres', 'estado','pd','ch','en','do'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  predonante = new PredonanteRequest();

  permiso: Permiso = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();

    let req = new PredonanteRequest();
    const fechaInicio = new Date();

    req.Idebanco = this.usuarioService.sessionUsuario().codigobanco;
    // req.FechaDesde = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
    req.FechaDesde = new Date();
    req.FechaHasta = new Date();
    req.IdeEstado = 1;
    req.Idecampania = 0;
    req.IdeOrigen = 0;
    req.Nombres = '';

    this.predonante= req;     
  }


  actualizar(){
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {

    this.predonante.Idebanco = this.usuarioService.sessionUsuario().codigobanco;
    this.predonanteService = new PredonanteService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.predonanteService!.listar(
            this.predonante.Idebanco!,
            this.predonante.IdeEstado!,
            this.predonante.Idecampania!,
            this.predonante.IdeOrigen!,
            this.predonante.Nombres!,
            this.predonante.FechaDesde!,
            this.predonante.FechaHasta!,
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

           this.loading = false;
           this.existRegistro = res === null;

          if (res === null) {
            return [];
          }

          this.countRegistro = res.pagination.total;

          console.log(res.items);
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));
  }


  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.aspirantesligth.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(MfaspiranteComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
      data:{
        fechaInicio : this.predonante.FechaDesde,
        fechaFin : this.predonante.FechaHasta,
        idestado : this.predonante.IdeEstado,
        idcampania : this.predonante.Idecampania,
        idorigen : this.predonante.IdeOrigen,
        nombre : this.predonante.Nombres,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        var req = new PredonanteRequest();

        req.Idebanco = this.usuarioService.sessionUsuario().codigobanco;
        req.FechaDesde =res.fechaInicio;
        req.FechaHasta = res.fechaFin;
        req.IdeEstado = res.idestado;
        req.Idecampania = res.idcampania;
        req.IdeOrigen = res.idorigen;
        req.Nombres = res.nombre;
  
        this.predonante= req;  
        this.ngAfterViewInit();
      }
    })
  }

  routeUrl(codigo: string, tipo:string){
    if(tipo=="pd"){
      this.router.navigate(['/page/donante/aspirante/create']);
    }else if(tipo=="ch"){
      this.router.navigate(['/page/donante/chequeo/create']);
    }else if(tipo=="en"){
      this.router.navigate(['/page/donante/entrevista/create']);
    }else if(tipo=="do"){
      this.router.navigate(['/page/donante/donacion/create']);
    }   
  }
  
}
