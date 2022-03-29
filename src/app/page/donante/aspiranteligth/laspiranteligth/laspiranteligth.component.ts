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

  user: any;
  predonante = new PredonanteRequest();

  claseColor: string = 'icon-estado'
  permiso: Permiso = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {
    this.user = this.usuarioService.sessionUsuario();
    this.obtenerpermiso();
  }

  ngAfterViewInit(){
      var req = new PredonanteRequest();
      const fechaInicio = new Date();

      req.Idebanco = this.user.codigobanco;
      req.FechaDesde = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
      req.FechaHasta = new Date();
      req.IdeEstado = 1;
      req.Idecampania = 0;
      req.IdeOrigen = 0;
      req.Nombres = '';

      this.predonante= req;
      
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
    const dialogRef =this.dialog.open(MfaspirantelingthComponent, {
      width: '800px',
      data:{
        idbanco: this.predonante.Idebanco,
        fechaInicio : this.predonante.FechaDesde,
        fechaFin : this.predonante.FechaHasta,
        idestado : this.predonante.IdeEstado,
        idcampania : this.predonante.Idecampania,
        idorigen : this.predonante.IdeOrigen,
        nombre : this.predonante.Nombres,
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      var req = new PredonanteRequest();
      req.Idebanco = res.idbanco;
      req.FechaDesde =res.fechaInicio;
      req.FechaHasta = res.fechaFin;
      req.IdeEstado = res.idestado;
      req.Idecampania = res.idcampania;
      req.IdeOrigen = res.idorigen;
      req.Nombres = res.nombre;

      this.predonante= req;

      this.buscar(req);
    })
  }

}
