import { Donacion } from 'src/app/_model/donante/donacion';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { environment } from 'src/environments/environment';
import { Permiso } from 'src/app/_model/permiso';
import { DonacionService } from 'src/app/_service/donante/donacion.service';
import { IfStmt } from '@angular/compiler';
import { Unidade } from 'src/app/_model/donante/unidade';

@Component({
  selector: 'app-cdonacion',
  templateUrl: './cdonacion.component.html',
  styleUrls: ['./cdonacion.component.css']
})
export class CdonacionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  listaTipoExtraccion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaTipoBolsa?: Combobox[] = [];
  listaBrazo?: Combobox[] = [];
  listaDificultad?: Combobox[] = [];
  listaHemoComponente?: Combobox[] = [];
  listaUnidade?: Unidade[] = [];
  
  donante: string = "";
  documento: string ="";
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btndisable: boolean = false;
  btnestado:boolean = false;
  vHoraIni?: string;
  vHoraFin?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private donacionService: DonacionService
  ) { }

  ngOnInit(): void {

    this.inicializar();

    this.obtenerpermiso();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit =(data["edit"]==undefined) ? true : (data["edit"]=='true')? true : false;
      this.btndisable = (this.id==0)? false: true;
      this.obtener(0);
    });
  }

  inicializar(){
    this.form = new FormGroup({
      'codDonacion': new FormControl({ value: '', disabled: true}),//ok
      'codPostulante': new FormControl({ value: '', disabled: true}),//ok
      'idePreDonante': new FormControl({ value: '', disabled: false}),//ok
      'ideDonacion': new FormControl({ value: '', disabled: false}),//ok
      'ideMuestra': new FormControl({ value: '', disabled: false}),//ok
      'ideExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'fecha': new FormControl({ value: '', disabled: false}),//ok
      'codTipoExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'ideGrupo': new FormControl({ value: '', disabled: false}),//ok
      'hemoglobina': new FormControl({ value: '', disabled: false}),//ok
      'hematocrito': new FormControl({ value: '', disabled: false}),//ok
      'codTubuladura': new FormControl({ value: '', disabled: false}),//ok
      'obsedrvaciones': new FormControl({ value: '', disabled: true}),//ok
      'vHoraIni': new FormControl({ value: '', disabled: false}),//ok
      'vHoraFin': new FormControl({ value: '', disabled: false}),//ok
      'fechaExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'tipoExtraccion': new FormControl({ value: '', disabled: false}),//ok
      'ideTipoBolsa': new FormControl({ value: '', disabled: false}),//ok
      'brazo': new FormControl({ value: '', disabled: false}),         //ok 
      'dificultad': new FormControl({ value: '', disabled: false}),//ok
      'operador': new FormControl({ value: '', disabled: false}),//ok
      'rendimiento': new FormControl({ value: '', disabled: false})//ok
    });
  }

  obtener(codigo: any){

    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    let ids=0;
    let cod="";
    this.donante = "";
    this.documento = "";

    if(codigo!=0){
      cod = (codigo.target.value==0)? this.id: codigo.target.value;
      cod = (cod==undefined)? this.form.value['codigo']: cod; 
      this.$disable = false;
    }else{
      ids=  this.id;
      this.$disable = true;
    }

    this.donacionService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaTipoBolsa = data.listaTipoBolsa;
      this.listaBrazo = data.listaBrazo;
      this.listaDificultad = data.listaDificultad;
      this.listaUnidade = data.listaExtraccionUnidad;

      if(ids!=0 || cod!=""){
    debugger;
        let $fecha = new Date();

        let $fechaReg= data.fecha==null? $fecha:data.fecha; 
        let $fechaExtr= data.fechaExtraccion==null? $fecha:data.fechaExtraccion; 

        this.vHoraIni = (data.vHoraIni==null)? (`${(new Date().getHours()<10?'0':'') + new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`) : data.vHoraIni;
        this.vHoraFin = (data.vHoraFin==null)? (`${(new Date().getHours()<10?'0':'') + new Date().getHours()}:${(new Date().getMinutes()<10?'0':'') + new Date().getMinutes()}`) : data.vHoraFin;

        this.form = new FormGroup({
          'codDonacion': new FormControl({ value: data.codDonacion, disabled: true}),//ok
          'codPostulante': new FormControl({ value: data.codPostulante, disabled: true}),//ok
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),//ok
          'ideDonacion': new FormControl({ value: data.ideDonacion, disabled: false}),//ok
          'ideMuestra': new FormControl({ value: data.ideMuestra, disabled: false}),//ok
          'ideExtraccion': new FormControl({ value: data.ideExtraccion, disabled: false}),//ok
          'fecha': new FormControl({ value: $fechaReg, disabled: false}),//ok
          'codTipoExtraccion': new FormControl({ value: data.codTipoExtraccion, disabled: false}),//ok
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: false}),//ok
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: false}),//ok
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: false}),//ok
          'codTubuladura': new FormControl({ value: data.codTubuladura, disabled: false}),//ok
          'obsedrvaciones': new FormControl({ value: data.obsedrvaciones, disabled: true}),//ok
          'vHoraIni': new FormControl({ value: this.vHoraIni, disabled: false}),//ok
          'vHoraFin': new FormControl({ value: this.vHoraFin, disabled: false}),//ok
          'fechaExtraccion': new FormControl({ value: $fechaExtr, disabled: false}),//ok
          'tipoExtraccion': new FormControl({ value: data.tipoExtraccion, disabled: false}),//ok
          'ideTipoBolsa': new FormControl({ value: data.ideTipoBolsa, disabled: false}),//ok
          'brazo': new FormControl({ value: data.brazo, disabled: false}),         //ok 
          'dificultad': new FormControl({ value: data.dificultad, disabled: false}),//ok
          'operador': new FormControl({ value: data.operador, disabled: false}),//ok
          'rendimiento': new FormControl({ value: data.rendimiento, disabled: false})//ok
        });

        // this.Codigo = data.codigo;
        // this.CodEstado = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        // this.btnestado = (this.CodEstado== "2")? true : false;
        this.donante = data.donante!;
        this.documento = data.documento!;

        if(data.idePreDonante==0 || data.idePreDonante==null){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
        }
      }

      this.spinner.hideLoading();
    });   

  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  guardar(){

    let model = new Donacion();

    /*Insertar Donacion */
    model.ideDonacion= this.form.value['ideDonacion'];
    model.idePreDonante= this.form.value['idePreDonante'];
    model.fecha= this.form.value['fecha'];
    model.codTipoExtraccion= this.form.value['codTipoExtraccion'];
    model.selloCalidad= this.form.value['selloCalidad'];

     /*Insertar Extraccion */
     model.ideExtraccion= this.form.value['ideExtraccion'];
     model.ideDonacion= this.form.value['ideDonacion'];
     model.fechaExtraccion= this.form.value['fechaExtraccion'];
     model.vHoraIni= this.form.value['vHoraIni'];
     model.vHoraFin= this.form.value['vHoraFin'];
     model.ideTipoBolsa= this.form.value['ideTipoBolsa'];
     model.brazo= this.form.value['brazo'];
     model.dificultad= this.form.value['dificultad'];
     model.rendimiento= this.form.value['rendimiento'];
     model.codTubuladura= this.form.value['codTubuladura'];
     model.operador= this.form.value['operador'];

    this.spinner.showLoading();
    this.donacionService.guardar(model).subscribe(data=>{
  
    this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
       if(data.typeResponse==environment.EXITO){
           this.router.navigate(['/page/donante/aspirante']);
           this.spinner.hideLoading();
        }else{
          this.spinner.hideLoading();
        }
    });

  }

  calcularhora(){

    let $fechaextraccion = this.form.value['fechaExtraccion'];
    let $horactual = this.form.value['horaIni'];
    let $addminuto = this.form.value['tipoExtraccion'];

    if($horactual!="" && $addminuto==undefined){

      $horactual = $horactual.split(':');

      let $hora =$horactual[0];
      let $minuto = $horactual[1];

      $fechaextraccion = $fechaextraccion.getFullYear() + "-" + ($fechaextraccion.getMonth() + 1) + "-" + $fechaextraccion.getDate() + " " + $hora + ":" + $minuto + ":" + 0;
      
      let $fecha = new Date( $fechaextraccion);

      this.vHoraFin= `${($fecha.getHours()<10?'0':'') + $fecha.getHours()}:${($fecha.getMinutes()<10?'0':'') + $fecha.getMinutes()}`;      

    }
    else if($horactual!=""){

       $horactual = $horactual.split(':');

      let $hora =$horactual[0];
      let $minuto = $horactual[1];

      $fechaextraccion = $fechaextraccion.getFullYear() + "-" + ($fechaextraccion.getMonth() + 1) + "-" + $fechaextraccion.getDate() + " " + $hora + ":" + $minuto + ":" + 0;
      
      let $fecha = new Date( $fechaextraccion);

      $fecha.setMinutes($fecha.getMinutes() + $addminuto);

      this.vHoraFin= `${($fecha.getHours()<10?'0':'') + $fecha.getHours()}:${($fecha.getMinutes()<10?'0':'') + $fecha.getMinutes()}`;      

    }else{
      this.vHoraFin = "";
    }
  }

  changevolumen(event: any, idePregunta?: number){

  }

  changepesototal(event: any, idePregunta?: number){

  }

  focus(name:any){
    name.focus();
    name.select();
  }

  limpiar(){
   this.inicializar();
  }

}
  

