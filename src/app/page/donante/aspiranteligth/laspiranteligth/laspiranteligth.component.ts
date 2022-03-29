import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Predonante, PredonanteRequest } from 'src/app/_model/predonante';
import { Combobox } from 'src/app/_model/combobox';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { NotifierService } from '../../../component/notifier/notifier.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import forms from 'src/assets/json/formulario.json';
import { Permiso } from 'src/app/_model/permiso';
import { MatDialog } from '@angular/material/dialog';
import { MfaspirantelingthComponent } from '../mfaspirantelingth/mfaspirantelingth.component';

@Component({
  selector: 'app-laspirantelight',
  templateUrl: './laspiranteligth.component.html',
  styleUrls: ['./laspiranteligth.component.css']
})
export class LaspiranteligthComponent implements OnInit {

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['codigo', 'nombres', 'estado', 'accion'];
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  curUser: number = 0;

  tablasMaestras = ['ORI', 'EstPD'];
  tbOrigen: Combobox[] = [];
  tbEstPd: Combobox[] = [];
  tbPais: Combobox[] = [];

  claseColor: string = 'icon-estado'
  permiso: Permiso = {};
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
    }
    this.listarCombo();
    this.obtenerpermiso();
  }

  ngAfterViewInit(){
    // this.predonanteService = new PredonanteService(this.http);
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // this.spinner.showLoading();

    /*merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.predonanteService!.listarLight(
            data,
            finicio,
            ffin,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
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
      ).subscribe(data => (this.dataSource = data));*/
      var req = new PredonanteRequest();
      req.Idebanco = 1;
      req.FechaDesde = new Date();
      req.FechaDesde.setDate(req.FechaDesde.getDate() - 30);
      req.FechaHasta = new Date();
      req.IdeEstado = 1;
      req.Idecampania = 1;
      req.IdeOrigen = 1;
      req.Nombres = '';
      this.buscar(req);
  }

  buscar(request: PredonanteRequest){
    this.loading = true;
    this.spinner.showLoading();
    this.predonanteService!.listarLight(request).subscribe(data=>{
      //debugger;
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        this.dataSource = data.items;

        //Extrae los valores únicos de los estados y crea clases de colores
        this.crearColores(this.dataSource);
      }      
      this.spinner.hideLoading();
      this.loading = false;
    });
  }

  crearColores(datos: Predonante[]){
    let colores: string[][] = [];
    let codCol: string[] = [];
    datos.forEach(e => {
      let codigo = e.codEstado!.toString();
      if (!codCol.includes(codigo)) {
        codCol.push(codigo);
        colores.push([codigo,e.colorhexa!]);            
      }
    });

    colores.forEach(e => {
      this.crearClasesCss(e[0], e[1]);
    });
  }

  listarCombo(){
    this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser).subscribe(data=>{
      //debugger;
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;

        this.tbOrigen = tbCombobox.filter(e => e.codTabla === 'ORI');
        this.tbEstPd = tbCombobox.filter(e => e.codTabla === 'EstPD');
      }
    });
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.aspirantesligth.codigo).subscribe(data=>{
      this.permiso = data;
      console.log(data);
       this.spinner.hideLoading();
    });   
  }

  crearClasesCss(id: string = '0', color: string = ''){
    var editCSS = document.createElement('style')
    editCSS.innerHTML = "." + this.claseColor + "-" + id + " {color: " + color + ";}";
    document.body.appendChild(editCSS);
  }

  abrirBusqueda(){
    this.dialog.open(MfaspirantelingthComponent, {
      width: '850px'
    });
  }

}
