import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Solicitud, SolicitudRequest } from 'src/app/_model/paciente/solicitud';
import { Permiso } from 'src/app/_model/permiso';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { SolicitudService } from 'src/app/_service/paciente/solicitud.service';
import { environment } from 'src/environments/environment';
import { FsolicitudComponent } from '../fsolicitud/fsolicitud.component';
import forms from 'src/assets/json/formulario.json';
import {merge, of as observableOf} from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-lsolicitud',
  templateUrl: './lsolicitud.component.html',
  styleUrls: ['./lsolicitud.component.css']
})
export class LsolicitudComponent implements OnInit {

  dataSource: Solicitud[] = [];
  displayedColumns: string[] = ['fecha', 'codigo', 'paciente', 'estado','requisito','mo'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  solicitud = new SolicitudRequest();

  permiso: Permiso = {};

  interval: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private solicitudService: SolicitudService,
    public customPaginator: MatPaginatorIntl,
    private configPermisoService : ConfigPermisoService
  ) { }

  ngOnInit(): void {
    this.configurarPaginador();
    this.obtenerpermiso();

    let filtro = this.usuarioService.sessionFiltro();

    if(filtro!=null){   
      this.solicitud.Codigo! = filtro[0];
      this.solicitud.CodUnidad! = filtro[1];
      this.solicitud.Paciente! = filtro[2];
      this.solicitud.IdeEstado! = parseInt(filtro[3]);
      this.solicitud.dFechaDesde! = new Date(filtro[4]);
      this.solicitud.dFechaHasta! = new Date(filtro[5]);
    }else{

      this.solicitud.Codigo! = "";
      this.solicitud.CodUnidad! = "";
      this.solicitud.Paciente! = "";
      this.solicitud.IdeEstado! = 1;
      this.solicitud.dFechaDesde! = new Date();
      this.solicitud.dFechaHasta! = new Date();
    }    

    localStorage.setItem(environment.CODIGO_FILTRO, this.solicitud.Codigo +"|"+ this.solicitud.CodUnidad+"|"+this.solicitud.Paciente+"|"+this.solicitud.IdeEstado+"|"+this.solicitud.dFechaDesde+"|"+this.solicitud.dFechaHasta);

    // this.startTimer();
  }

  configurarPaginador(){
    this.customPaginator.itemsPerPageLabel = 'Ítems por página';
    this.customPaginator.firstPageLabel = 'Primera página';    
    this.customPaginator.previousPageLabel = 'Página anterior'; 
    this.customPaginator.nextPageLabel  = 'Página siguiente';
    this.customPaginator.lastPageLabel = 'Última página';
    this.customPaginator.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 a ${length }`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
  }

  actualizar(){
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.solicitudService = new SolicitudService(this.http);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          // this.loading = true;
          let filtro = this.usuarioService.sessionFiltro();
          let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
          
          return this.solicitudService!.listar(
            codigobanco,
            1,
            "",
            "",
            "",
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
    console.log(forms.aspirante.codigo);
    this.configPermisoService.obtenerpermiso(forms.solicitud.codigo).subscribe(data=>{
      this.permiso = data;
      console.log(data);
       this.spinner.hideLoading();
    });   
  }

  abrirBusqueda(){
    const dialogRef =this.dialog.open(FsolicitudComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '850px',
      panelClass: 'full-screen-modal',
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=""){

        this.paginator.pageIndex = 0,
        this.paginator.pageSize = 5
        this.ngAfterViewInit();
        }
    })
  }

  abrirUnidades(){

  }

  
  routeUrl(id: string){
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
    this.router.navigate(['/page/paciente/solicitud/edit/'+id+"/"+editar]);
    
  }
}
