import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';

import { PredonanteService } from 'src/app/_service/donante/predonante.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { Permiso } from 'src/app/_model/permiso';
import { MatDialog } from '@angular/material/dialog';

import { MfaspiranteComponent } from '../mfaspirante/mfaspirante.component';
import { Predonante, PredonanteRequest } from 'src/app/_model/donante/predonante';
import forms from 'src/assets/json/formulario.json';
import { environment } from 'src/environments/environment';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { RptfichaComponent } from 'src/app/page/reporte/rptficha/rptficha.component';
import { ReporteService } from 'src/app/_service/reporte/reporte.service';


@Component({
  selector: 'app-laspirante',
  templateUrl: './laspirante.component.html',
  styleUrls: ['./laspirante.component.css']
})
export class LaspiranteComponent implements OnInit {

  @ViewChild(RptfichaComponent) rptficha!: RptfichaComponent;

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['codigo', 'nombres', 'estado','pd','ch','en','do','mo', 'ficha'];
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
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
    private reporteService: ReporteService
  ) { }

  ngOnInit(): void {
    this.obtenerpermiso();

    let filtro = this.usuarioService.sessionFiltro();

    if(filtro!=null){   
      this.predonante.Nombres! = filtro[0];
      this.predonante.Idecampania! = parseInt(filtro[1]);
      this.predonante.IdeOrigen! = parseInt(filtro[2]);
      this.predonante.IdeEstado! = parseInt(filtro[3]);
      this.predonante.FechaDesde! = new Date(filtro[4]);
      this.predonante.FechaHasta! = new Date(filtro[5]);
    }else{

      this.predonante.Nombres! = "";
      this.predonante.Idecampania! = 0;
      this.predonante.IdeOrigen! = 0;
      this.predonante.IdeEstado! = 1;
      this.predonante.FechaDesde! = new Date();
      this.predonante.FechaHasta! = new Date();
    }    

    localStorage.setItem(environment.CODIGO_FILTRO, this.predonante.Nombres +"|"+ this.predonante.Idecampania+"|"+this.predonante.IdeOrigen+"|"+this.predonante.IdeEstado+"|"+this.predonante.FechaDesde+"|"+this.predonante.FechaHasta);
 
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {

    

    this.predonanteService = new PredonanteService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          let filtro = this.usuarioService.sessionFiltro();
          let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
          
          return this.predonanteService!.listar(
            codigobanco,
            parseInt(filtro![3]),
            parseInt(filtro![1]),
            parseInt(filtro![2]),
            filtro![0],
            new Date(filtro![4]),
            new Date(filtro![5]),
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
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){
        this.ngAfterViewInit();
        }
    })
  }

  
  routeUrl(id: string, tipo:string){
    var editar = true;

    //PERMISO
    var editar = true;
    if(this.permiso.guardar)
      editar = true;
    else if(this.permiso.ver)
      editar = false;
    else
      return; 

      
    //URL
    if(tipo=="pd"){
      this.router.navigate(['/page/donante/aspirante/edit/'+id+"/"+editar]);
    }else if(tipo=="ch"){
      this.router.navigate(['/page/donante/chequeo/edit/'+id+"/"+editar]);
    }else if(tipo=="en"){
      this.router.navigate(['/page/donante/entrevista/edit/'+id+"/"+editar]);
    }else if(tipo=="do"){
      this.router.navigate(['/page/donante/donacion/edit/'+id+"/"+editar]);
    }   
  }

  imprimirFicha(idepredonante: number){
    if(idepredonante == 0){
      this.notifierService.showNotification(2,'Mensaje',"No se encontro la donación");
    }
    else{
      this.spinner.showLoading();
      this.reporteService.rptficha(idepredonante).subscribe(data=>{
        //console.log(data);

        this.rptficha.tipDocu = '';
        this.rptficha.numDocu = data.numDocu;
        this.rptficha.apPaterno = data.apPaterno;
        this.rptficha.apMaterno = data.apMaterno;
        this.rptficha.primerNombre = data.primerNombre;
        this.rptficha.fecNacimiento = data.vFecNacimiento;
        this.rptficha.edad = data.edad;
        this.rptficha.sexo = data.sexo;
        this.rptficha.estadoCivil = data.estadoCivil;
        this.rptficha.lugarNacimiento = data.lugarNacimiento;
        this.rptficha.procedencia = data.procedencia;
        this.rptficha.direccion = data.direccion;
        this.rptficha.distrito = data.distrito;
        this.rptficha.provincia = data.provincia;
        this.rptficha.departamento = data.departamento;
        this.rptficha.ocupacion = data.ocupacion;
        this.rptficha.telefono = data.telefono;
        this.rptficha.celular = data.celular;
        this.rptficha.correo = data.correo1;
        this.rptficha.lugarTrabajo = data.lugarTrabajo;
        this.rptficha.codigoPre = data.codigoPre;
        this.rptficha.fechaDona = data.vFechaDona;
        this.rptficha.tipoDonacion = data.tipoDonacion;
        this.rptficha.tipoExtraccion = data.tipoExtraccion;
        this.rptficha.personaRelacion = data.personaRelacion;
        this.rptficha.grupoABO = data.grupoABO;
        this.rptficha.hemoglobina = data.hemoglobina;
        this.rptficha.hematocrito = data.hematocrito;
        this.rptficha.tallaDonacion = data.tallaDonacion;
        this.rptficha.pesoDonacion = data.pesoDonacion;
        this.rptficha.presionArterial = '';
        this.rptficha.frecuenciaCardiaca = '';
        this.rptficha.viajes = data.viajes;
        this.rptficha.permanencia = data.permanencia;
        this.rptficha.fechaViaje = data.vFechaViaje;
        this.rptficha.lesionesVenas = data.lesionesVenas;
        this.rptficha.estadoVenoso = data.estadoVenoso;
        this.rptficha.campo1A = data.campo1A;
        this.rptficha.campo2A = data.campo2A;
        this.rptficha.campo3A = data.campo3A;
        this.rptficha.campo4A = data.campo4A;
        this.rptficha.campo4B = '';
        this.rptficha.campo5A = data.campo5A;
        this.rptficha.campo5B = '';
        this.rptficha.campo6A = data.campo6A;
        this.rptficha.campo6B = '';
        this.rptficha.campo7A = data.campo7A;
        this.rptficha.campo8A = data.campo8A;
        this.rptficha.campo9A = data.campo9A;
        this.rptficha.campo10A = data.campo10A;
        this.rptficha.campo10B = '';
        this.rptficha.campo11A = data.campo11A;
        this.rptficha.campo12A = data.campo12A;
        this.rptficha.campo13A = data.campo13A;
        this.rptficha.campo14A = data.campo14A;
        this.rptficha.campo14B = '';
        this.rptficha.campo15A = data.campo15A;
        this.rptficha.campo16A = data.campo16A;
        this.rptficha.campo17A = data.campo17A;
        this.rptficha.campo18A = data.campo18A;
        this.rptficha.campo19A = data.campo19A;
        this.rptficha.campo20A = data.campo20A;
        this.rptficha.campo21A = data.campo21A;
        this.rptficha.campo22A = data.campo22A;
        this.rptficha.campo23A = data.campo23A;
        this.rptficha.campo24A = data.campo24A;
        this.rptficha.campo25A = data.campo25A;
        this.rptficha.campo26A = data.campo26A;
        this.rptficha.campo27A = data.campo27A;
        this.rptficha.campo28A = data.campo28A;
        this.rptficha.campo29A = data.campo29A;
        this.rptficha.campo29B = '';
        this.rptficha.estado = data.estado;
        this.rptficha.motivoRec = data.motivoRec;
        this.rptficha.periodoRechazo = data.periodoRechazo;
        this.rptficha.observacionesChec = data.observacionesChec;
        this.rptficha.faseRechazo = data.faseRechazo;
        this.rptficha.titulo = data.titulo;
        this.rptficha.subTitulo1 = data.subTitulo1;
        this.rptficha.subTitulo2 = data.subTitulo2;
        this.rptficha.logo = data.strLogo;
        this.rptficha.codDonacion = data.codDonacion;

        setTimeout(function(){
          const printContents = document.getElementById('imprimir-seccion')!.innerHTML;
              const popupWin = window.open('', '_blank', 'top=0,left=0,height=1000,width=1000')!;
              popupWin.document.open();
              popupWin.document.write(`
                  <html>
                      <head>
                          <title>Pestaña de impresión</title>
                        
                      </head>
                      <body onload="window.print(); window.close()">
                          ${printContents}
                      </body>
                  </html>
                  `
              );
            popupWin.document.close();
        },200);
        this.spinner.hideLoading();
      });
    }
  }
  
}
