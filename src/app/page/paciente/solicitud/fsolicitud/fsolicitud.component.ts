import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { SolicitudService } from 'src/app/_service/paciente/solicitud.service';
import { environment } from 'src/environments/environment';
import jsonEstado from 'src/assets/json/solicitud/estados.json';

@Component({
  selector: 'app-fsolicitud',
  templateUrl: './fsolicitud.component.html',
  styleUrls: ['./fsolicitud.component.css']
})
export class FsolicitudComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<FsolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private solicitudService : SolicitudService,
    private usuarioService: UsuarioService,
    private notifierService: NotifierService,
    private comboboxService: ComboboxService,
  ) { }

  loading = true;
  curUser?: number;
  curBanco?: number;

  codigo? : string;
  unidad? : string;
  paciente? : string;

  listaPrioridad?: Combobox[] = [];
  idprioridad?: string;

  listaEstado?: Combobox[] = [];
  idestado?: string;

  fechaInicio?: Date;
  fechaSelectInicio?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  fechaMax?: Date;

  ngOnInit(): void {
    this.fechaMax = new Date();
    //atributos de tokeN usuario
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
      this.curBanco = user.codigobanco;
    }
    this.obtener();
  }

  obtener(){

    this.spinner.showLoading();
    this.comboboxService.cargarDatos(['PRIO'],this.curUser!,this.curBanco).subscribe(data=>{
      if(data === undefined){
        this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;        

        //Prioridades
        var todos = new Combobox();
        todos.codigo = '';
        todos.descripcion = 'TODOS';
        this.listaPrioridad?.push(todos);
        this.listaPrioridad = this.listaPrioridad?.concat(tbCombobox);

        //Estados
        this.listaEstado = this.completarCombo(jsonEstado);

        let filtro = this.usuarioService.sessionFiltro();

        this.codigo= filtro![0];
        this.unidad=filtro![1];
        this.paciente=filtro![2];
        this.idestado=filtro![3];
        this.fechaSelectInicio=new Date(filtro![4]);
        this.fechaInicio=new Date(filtro![4]);
        this.fechaSelectFin=new Date(filtro![5]);
        this.fechaFin=new Date(filtro![5]);
        this.idprioridad=filtro![6];
        this.spinner.hideLoading();
      }
    });  
  }

  completarCombo(json: any){
    var tbCombo = [];

    for(var i in json) {
      let el: Combobox = {};

      el.codigo = json[i].valor;
      el.descripcion = json[i].descripcion;
      el.visible = json[i].visible;
      
      tbCombo.push(el);
    }

    return tbCombo;
  }

  selectprioridad(id: string){
    this.idprioridad= id;
  }

  selectestado(id: string){
    this.idestado= id;
  }
  
  onDateChange(){
    this.fechaInicio = this.fechaSelectInicio;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){
    this.codigo="";
    this.unidad = "";
    this.paciente = "";
    this.idestado = "0";
    this.fechaInicio = this.fechaMax;
    this.fechaInicio!.setMonth(this.fechaMax!.getMonth() - 9);
    this.fechaFin = new Date();
    this.idprioridad = "";

    this.setFiltros();
  }

  buscar(){
    this.dialogRef.close();

    this.setFiltros();
  }

  setFiltros(){
    localStorage.setItem(environment.CODIGO_FILTRO, this.codigo +"|"+ this.unidad+"|"+this.paciente+"|"+this.idestado+"|"+this.fechaInicio+"|"+this.fechaFin+"|"+this.idprioridad);
  }
}
