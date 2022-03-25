import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { Persona } from 'src/app/_model/persona';
import { Predonante, PredonanteRequest } from 'src/app/_model/predonante';
import { Combobox } from 'src/app/_model/combobox';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { NotifierService } from '../../../component/notifier/notifier.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-laspirantelight',
  templateUrl: './laspiranteligth.component.html',
  styleUrls: ['./laspiranteligth.component.css']
})
export class LaspiranteligthComponent implements OnInit {

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['codigo', 'nombres', 'estado', 'accion'];
  loading = false;
  existRegistro = false;
  countRegistro = 0;

  curUser: number = 0;

  tablasMaestras = ['ORI', 'EstPD'];
  tbCombobox: Combobox[] = [];
  tbOrigen: Combobox[] = [];
  tbEstPd: Combobox[] = [];

  claseColor: string = 'icon-estado'

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService
  ) { }

  ngOnInit(): void {
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
    }
    this.listarCombo();
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
    this.predonanteService!.listarLight(request).subscribe(data=>{
      //debugger;
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        this.dataSource = data.items;

        let colores: string[][] = [];
        let codCol: string[] = [];
        this.dataSource.forEach(e => {
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
      this.spinner.hideLoading();
    });
  }

  listarCombo(){
    this.spinner.showLoading();
    
    
    this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser).subscribe(data=>{
      //debugger;
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        this.tbCombobox = data.items;

        this.tbOrigen = this.tbCombobox.filter(e => e.codTabla === 'ORI');
        this.tbEstPd = this.tbCombobox.filter(e => e.codTabla === 'EstPD');
      }
      this.spinner.hideLoading();
    });
  }

  crearClasesCss(id: string = '0', color: string = ''){
    var editCSS = document.createElement('style')
    editCSS.innerHTML = "." + this.claseColor + "-" + id + " {color: " + color + ";}";
    document.body.appendChild(editCSS);
  }

}
