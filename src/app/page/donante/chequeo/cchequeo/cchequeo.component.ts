import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ChequeofisicoService } from 'src/app/_service/chequeofisico.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { ChequeoFisico } from 'src/app/_model/chequeofisico';
import { Permiso } from 'src/app/_model/permiso';

@Component({
  selector: 'app-cchequeo',
  templateUrl: './cchequeo.component.html',
  styleUrls: ['./cchequeo.component.css']
})
export class CchequeoComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};
  
  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoGeneral?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  listaMotivoRechazo?: Combobox[] = [];

  nombres: string = "";
  documento: string ="";
  CodEstado: string = "";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btndisable: boolean = false;
  btnestado:boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private chequeofisicoService: ChequeofisicoService,
  ) { }

  ngOnInit(): void {

    this.inicializar();

    this.obtenerpermiso();

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : (data["edit"]=='true')? true : false;
      this.btndisable = (this.id==0)? false: true;
      this.obtener(0);
    });
  }

  inicializar(){
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: 0, disabled: false}),
      'tipoExtraccion': new FormControl({ value: '', disabled: true}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'fecha': new FormControl({ value: new Date(), disabled: false}),
      'pesoDonacion': new FormControl({ value: '', disabled: false}),
      'tallaDonacion': new FormControl({ value: '', disabled: false}),
      'hemoglobina': new FormControl({ value: '', disabled: false}),
      'hematocrito': new FormControl({ value: '', disabled: false}),
      'plaquetas': new FormControl({ value: '', disabled: false}),
      'presionArterial1': new FormControl({ value: '', disabled: false}),
      'presionArterial2': new FormControl({ value: '', disabled: false}),
      'presionArterial': new FormControl({ value: '', disabled: false}),
      'frecuenciaCardiaca': new FormControl({ value: '', disabled: false}),
      'ideGrupo': new FormControl({ value: '', disabled: false}),
      'aspectoGeneral': new FormControl({ value: '', disabled: false}),
      'lesionesVenas': new FormControl({ value: '', disabled: false}),
      'estadoVenoso': new FormControl({ value: '', disabled: false}),
      'obsedrvaciones': new FormControl({ value: '', disabled: false}),
      'temperatura': new FormControl({ value: '', disabled: false}),
      'ideMotivoRec': new FormControl({ value: '', disabled: false})
    });

    this.CodEstado = "0";
  }
  
  obtener(codigo: any){

    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    let ids=0;
    let cod=0;
    this.nombres = "";
    this.documento = "";

    if(codigo!=0){
      cod = (codigo.target.value==0)? this.id: codigo.target.value;
      cod = (cod==undefined)? this.form.value['codigo']: cod; 
      this.$disable = false;
    }else{
      ids=  this.id;
      this.$disable = true;
    }

    this.chequeofisicoService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoGeneral = data.listaAspectoGeneral;
      this.listaAspectoVenoso = data.listaAspectoVenoso;
      this.listaMotivoRechazo = data.listaMotivoRechazo;

      if(ids!=0 || cod!=0){

        let aterrial1='';
        let aterrial2='';
        if(data.presionArterial!="" && data.presionArterial!=null){
          let aterrial= data.presionArterial?.split('/');
  
          if(aterrial!.length>1){
            aterrial1= aterrial![0];
            aterrial2= aterrial![1];
          }
        }
     
        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'tipoExtraccion': new FormControl({ value: data.tipoExtraccion, disabled: true}),
          'codigo': new FormControl({ value: data.codigo, disabled: this.$disable}),
          'fecha': new FormControl({ value: data.fecha, disabled: !this.edit}),
          'pesoDonacion': new FormControl({ value: data.pesoDonacion, disabled: !this.edit}),
          'tallaDonacion': new FormControl({ value: data.tallaDonacion, disabled: !this.edit}),
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: !this.edit}),
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: !this.edit}),
          'plaquetas': new FormControl({ value: data.plaquetas, disabled: !this.edit}),
          'presionArterial1': new FormControl({ value: aterrial1, disabled: !this.edit}),
          'presionArterial2': new FormControl({ value: aterrial2, disabled: !this.edit}),
          'presionArterial': new FormControl({ value: data.presionArterial, disabled: !this.edit}),
          'frecuenciaCardiaca': new FormControl({ value: data.frecuenciaCardiaca, disabled: !this.edit}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: !this.edit}),
          'aspectoGeneral': new FormControl({ value: data.aspectoGeneral, disabled: !this.edit}),
          'lesionesVenas': new FormControl({ value: data.lesionesVenas, disabled: !this.edit}),
          'estadoVenoso': new FormControl({ value: data.estadoVenoso, disabled: !this.edit}),
          'obsedrvaciones': new FormControl({ value: data.obsedrvaciones, disabled: !this.edit}),
          'temperatura': new FormControl({ value: data.temperatura, disabled: !this.edit}),
          'ideMotivoRec': new FormControl({ value: data.ideMotivoRec?.toString(), disabled: !this.edit}),
        });

        this.Codigo = data.codigo;
        this.CodEstado = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        this.btnestado = (this.CodEstado== "2")? true : false;
        this.nombres = data.nombres!;
        this.documento = data.documento!;

        if(data.idePreDonante==0 || data.idePreDonante==null){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
        }

      }

      this.spinner.hideLoading();
    });      
  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.chequeo.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  changeestado(estado: string){
    if(!this.btnestado){
      this.CodEstado= estado;
    }else{
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Cuando el estado es NO APTO, no se podra cambiar');
    }
  }

  guardar(){
        
      let response = this.validaciones();
debugger;
      if(response!=""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje', response);
      }else{

        let model = new ChequeoFisico();
  
        model.idePreDonante= this.form.value['idePreDonante'];
        model.codigo= this.Codigo;
        model.fecha= this.form.value['fecha'];
        model.pesoDonacion= Number(this.form.value['pesoDonacion']);
        model.tallaDonacion= Number(this.form.value['tallaDonacion']);
        model.hemoglobina= Number(this.form.value['hemoglobina']);
        model.hematocrito= Number(this.form.value['hematocrito']);
        model.plaquetas= Number(this.form.value['plaquetas']);
        model.presionArterial= this.form.value['presionArterial1'] + "/" + this.form.value['presionArterial2'];
        model.frecuenciaCardiaca= Number(this.form.value['frecuenciaCardiaca']);
        model.ideGrupo= this.form.value['ideGrupo'];
        model.aspectoGeneral= this.form.value['aspectoGeneral'];
        model.lesionesVenas= this.form.value['lesionesVenas'];
        model.estadoVenoso= this.form.value['estadoVenoso'];
        model.obsedrvaciones= this.form.value['obsedrvaciones'];
        model.temperatura= Number(this.form.value['temperatura']);
        model.codEstado=  this.CodEstado;
        model.ideMotivoRec= this.form.value['ideMotivoRec'];
        model.aceptaAlarma= "0";

        this.spinner.showLoading();
        this.chequeofisicoService.guardar(model).subscribe(data=>{
  
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
  
          if(data.typeResponse==environment.EXITO){
            this.router.navigate(['/page/donante/aspirante']);
            this.spinner.hideLoading();
          }else{
            this.spinner.hideLoading();
          }
        });

      }
  }

  focus(name:any){
      name.focus();
      name.select();
  }

  limpiar(){
    this.inicializar();
  }

  validaciones(){

    let mensaje ="";

    let $id = this.form.value['idePreDonante'];
    let $ideMotivoRec= this.form.value['ideMotivoRec'];
    let $peso  = this.esNumero(this.form.value['pesoDonacion']);
    let $talla = this.esNumero(this.form.value['tallaDonacion']);
    let $hemoglobina= this.esNumero(this.form.value['hemoglobina']);
    let $hematocrito= this.esNumero(this.form.value['hematocrito']);   
    let $presion1 = this.esNumero(this.form.value['presionArterial1']);
    let $presion2= this.esNumero(this.form.value['presionArterial2']);   

    if($id==null  || $id== "" || $id==0){
      mensaje = "El código al que hace referencia no existe";
    }
    else if(this.CodEstado=="2" && $ideMotivoRec==undefined){
      mensaje = "Seleccione el motivo del rechazo";
    }
    else if($peso==environment.ALERT){
      mensaje = "El peso debe agregarse con kilos y gramos";
    }
    else if($talla==environment.ALERT){
      mensaje = "La talla debe agregarse con metro y centimetros";
    }
    else if($presion1==environment.ALERT){
      mensaje = "La medida sistolica solo es n° entero";
    }
    else if($presion2==environment.ALERT){
      mensaje = "La medida diastolica solo es n° entero";
    }
    else if($hemoglobina==environment.ALERT){
      mensaje = "La hemoglobina debe agregarse con gramos y decilitro";
    }
    else if($hematocrito==environment.ALERT){
      mensaje = "La hematocrito es con porcentaje";
    }
   
    return mensaje;

  }

  
  esNumero (dato: string){
    /*Definición de los valores aceptados*/
    var valoresAceptados = /^[0-9]+$/;

    dato = dato.toString();

    if(dato=="" || dato==null || dato==undefined){
      return environment.OTRO;
    }
    else if (dato.indexOf(".") === -1 ){
        if (dato.match(valoresAceptados)){
           return environment.EXITO;
        }else{
           return environment.ALERT;
        }
    }else{
        //dividir la expresión por el punto en un array
        var particion = dato.split(".");
        //evaluamos la primera parte de la división (parte entera)
        if (particion[0].match(valoresAceptados) || particion[0]==""){
            if (particion[1].match(valoresAceptados)){
                return environment.EXITO;
            }else {
                return environment.ALERT;
            }
        }else{
            return environment.ALERT;
        }
    }
}

}
