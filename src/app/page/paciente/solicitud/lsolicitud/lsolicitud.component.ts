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
import { Combobox } from 'src/app/_model/combobox';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';

@Component({
  selector: 'app-lsolicitud',
  templateUrl: './lsolicitud.component.html',
  styleUrls: ['./lsolicitud.component.css']
})
export class LsolicitudComponent implements OnInit {

  dataSource: Solicitud[] = [];
  displayedColumns: string[] = ['fecha', 'codigoW', 'codigoM', 'paciente', 'estado','requisito','accion'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  tablasMaestras = ['PRIO'];
  tbPriori: Combobox[] = [];

  fechaMax?: Date;

  solicitud = new SolicitudRequest();

  permiso: Permiso = {};
  curUser: number = 0;
  curBanco: number = 0;

  interval: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private dialog: MatDialog,
    private spinner: SpinnerService,    
    private notifierService : NotifierService,
    private comboboxService: ComboboxService,
    private confirm : ConfimService,
    private usuarioService: UsuarioService,
    private solicitudService: SolicitudService,
    public customPaginator: MatPaginatorIntl,
    private configPermisoService : ConfigPermisoService
  ) { }

  ngOnInit(): void {
    this.configurarPaginador();
    this.obtenerpermiso();

    //atributos de tokeN usuario
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
      this.curBanco = user.codigobanco;
    }
    this.listarCombo();

    this.fechaMax = new Date();

    let filtro = this.usuarioService.sessionFiltro();

    if(filtro!=null){   
      this.solicitud.Codigo! = filtro[0];
      this.solicitud.CodUnidad! = filtro[1];
      this.solicitud.Paciente! = filtro[2];
      this.solicitud.IdeEstado! = parseInt(filtro[3]);
      this.solicitud.dFechaDesde! = new Date(filtro[4]);
      this.solicitud.dFechaHasta! = new Date(filtro[5]);
      this.solicitud.CodPrioridad! = filtro[6];
    }else{
      this.solicitud.Codigo! = "";
      this.solicitud.CodUnidad! = "";
      this.solicitud.Paciente! = "";
      this.solicitud.IdeEstado! = 0; //Todos
      this.solicitud.dFechaDesde! = this.fechaMax;
      this.solicitud.dFechaDesde!.setMonth(this.fechaMax.getMonth() - 9);      
      this.solicitud.dFechaHasta! = new Date();
      this.solicitud.CodPrioridad! = "";
    }    

    localStorage.setItem(environment.CODIGO_FILTRO, this.solicitud.Codigo +"|"+ this.solicitud.CodUnidad+"|"+this.solicitud.Paciente+"|"+this.solicitud.IdeEstado+"|"+this.solicitud.dFechaDesde+"|"+this.solicitud.dFechaHasta+"|"+this.solicitud.CodPrioridad);

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

  listarCombo(){
    this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser,this.curBanco).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;

        this.tbPriori = this.obtenerSubtabla(tbCombobox,'PRIO');
      }
    });
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.codTabla?.trim() === cod);
  }

  getDescripcion(value: string, lista: Combobox[]){
    //debugger;
    var obj = lista?.find(e => e.codigo === value);
    var desc: string = '';
    if(obj !== undefined)
      desc = obj.descripcion!;
    return desc;
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
            parseInt(filtro![3]),
            filtro![0],
            filtro![2],
            filtro![1],
            new Date(filtro![4]),
            new Date(filtro![5]),
            filtro![6],
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

  cancelar(id: number, estado: number){
    if(estado > 1){ //Unidades reservadas o enviadas
      this.notifierService.showNotification(environment.ALERT,'Mensaje','La solicitud ya tiene unidades Reservadas o Enviadas, no se puede modificar.');
    }
    else{
      this.confirm.openConfirmDialog(false, 'Confirma actualizar los datos de la solicitud.').afterClosed().subscribe(res =>{
        //Ok
        if(res){
          //console.log('Sí');
          this.$cancelar(id);
        }
        else{
          //console.log('No');
        }
      });
    }
  }

  $cancelar(id: number){
    this.spinner.showLoading();
    this.solicitudService.cancelar(id).subscribe(data=>{
      //debugger;
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
        
        this.spinner.hideLoading();

        if(data.typeResponse==environment.EXITO){
          this.ngAfterViewInit();
        }
    });
    }
  }
