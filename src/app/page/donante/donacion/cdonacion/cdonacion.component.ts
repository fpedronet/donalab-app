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

  nombres: string = "";
  documento: string ="";
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btndisable: boolean = false;
  btnestado:boolean = false;

  time: any;
  
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
      'idePreDonante': new FormControl({ value: '', disabled: false}),
      'ideDonacion': new FormControl({ value: '', disabled: false}),
      'dFechaRegistro': new FormControl({ value: '', disabled: false}),
      'dFechaExtraccion': new FormControl({ value: '', disabled: false}),
      'codTipoExtraccion': new FormControl({ value: '', disabled: false}),
      'ideGrupo': new FormControl({ value: '', disabled: false}),
      'ideTipoBolsa': new FormControl({ value: '', disabled: false}),
      'ideBrazo': new FormControl({ value: '', disabled: false}),
      'ideDificultad': new FormControl({ value: '', disabled: false}),
    });

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

    this.donacionService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaTipoBolsa = data.listaTipoBolsa;
      this.listaBrazo = data.listaBrazo;
      this.listaDificultad = data.listaDificultad;

      // if(ids!=0 || cod!=0){
     
        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'ideDonacion': new FormControl({ value: data.ideDonacion, disabled: false}),
          'dFechaRegistro': new FormControl({ value: data.dFechaRegistro, disabled: false}),
          'dFechaExtraccion': new FormControl({ value: data.dFechaExtraccion, disabled: false}),
          'codTipoExtraccion': new FormControl({ value: data.codTipoExtraccion, disabled: false}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: false}),
          'ideTipoBolsa': new FormControl({ value: data.ideTipoBolsa, disabled: false}),
          'ideBrazo': new FormControl({ value: data.ideBrazo, disabled: false}),
          'ideDificultad': new FormControl({ value: data.ideDificultad, disabled: false}),

        });

        // this.Codigo = data.codigo;
        // this.CodEstado = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        // this.btnestado = (this.CodEstado== "2")? true : false;
        this.nombres = data.nombres!;
        this.documento = data.documento!;

        if(data.idePreDonante==0 || data.idePreDonante==null){
          this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
        }

      // }

      this.spinner.hideLoading();
    });   

  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  guardar(){

  }

  focus(name:any){
    name.focus();
    name.select();
  }

  limpiar(){
   this.inicializar();
  }

}
  

