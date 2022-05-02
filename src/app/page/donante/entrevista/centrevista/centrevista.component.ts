import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { EntrevistaService } from 'src/app/_service/donante/entrevista.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { Pregunta } from 'src/app/_model/donante/pregunta';
import { Entrevista } from 'src/app/_model/donante/entrevista';
import { environment } from 'src/environments/environment';
import { Permiso } from 'src/app/_model/permiso';
import { ReporteService } from 'src/app/_service/reporte/reporte.service';
import { RptfichaComponent } from 'src/app/page/reporte/rptficha/rptficha.component';

// import { pdfDefaultOptions } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-centrevista',
  templateUrl: './centrevista.component.html',
  styleUrls: ['./centrevista.component.css']
})
export class CentrevistaComponent implements OnInit {

  @ViewChild(RptfichaComponent) rptficha!: RptfichaComponent;
  
  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  listaPregunta?: Pregunta[] = [];
  
  nombres: string = "";
  documento: string ="";
  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  edit: boolean = true;
  $disable: boolean =false;
  btnaceptado: boolean = false;
  btnrechazado: boolean = false;
  btndisable: boolean = false;
  currentTab: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
    private entrevistaService: EntrevistaService,
    private reporteService: ReporteService
  ) {
    // pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }

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
      'codigo': new FormControl({ value: '', disabled: false}),
      'ideMotivoRec': new FormControl({ value: '', disabled: false}),
      'pesoDonacion': new FormControl({ value: '', disabled: true}),
      'hemoglobina': new FormControl({ value: '', disabled: true}),
      'nIdTipoProceso': new FormControl({ value: '', disabled: false}),
      'tallaDonacion': new FormControl({ value: '', disabled: true}),
      'hematocrito': new FormControl({ value: '', disabled: true}),
      'tipoExtraccion': new FormControl({ value: '', disabled: true}),
      'ideGrupo': new FormControl({ value: '', disabled: true}),
      'estadoVenoso': new FormControl({ value: '', disabled: true}),
      'lesionesVenas': new FormControl({ value: '', disabled: true}),
      'fechaMed': new FormControl({ value: new Date(), disabled: false}),
      'observacionesMed': new FormControl({ value: '', disabled: false}),
    });

    this.btnaceptado= false;
    this.btnrechazado= false;
    this.listaPregunta = [];
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

    this.entrevistaService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoVenoso = data.listaAspectoVenoso;
      this.listaPregunta = data.listaPregunta;

      if(ids!=0 || cod!=0){

        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'codigo': new FormControl({ value: data.codigo, disabled: this.$disable}),
          'ideMotivoRec': new FormControl({ value: data.ideMotivoRec, disabled: !this.edit}),
          'pesoDonacion': new FormControl({ value: data.pesoDonacion, disabled: true}),
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: true}),
          'nIdTipoProceso': new FormControl({ value: data.nIdTipoProceso, disabled: !this.edit}),
          'tallaDonacion': new FormControl({ value: data.tallaDonacion, disabled: true}),
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: true}),
          'tipoExtraccion': new FormControl({ value: data.tipoExtraccion, disabled: true}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: true}),
          'estadoVenoso': new FormControl({ value: data.estadoVenoso, disabled: true}),
          'lesionesVenas': new FormControl({ value: data.lesionesVenas, disabled: true}),
          'fechaMed': new FormControl({ value: new Date(), disabled: !this.edit}),
          'observacionesMed': new FormControl({ value: data.observacionesMed, disabled: !this.edit}),
        });

        this.Codigo = data.codigo;
        this.CodEstado = (data.codEstado!=null)? data.codEstado!.toString()! : "0";
        this.nombres = data.nombres!;
        this.documento = data.documento!;

        if(this.CodEstado=="1"){
          this.btnaceptado= true;
          this.btnrechazado= false;
        }else if (this.CodEstado=="2"){
          this.btnaceptado= false;
          this.btnrechazado= true;
        }else{
          this.btnaceptado= false;
          this.btnrechazado= false;
        }

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

  changeestado(estado: string, btn: string){
    this.CodEstado= estado;

    if(btn=="btn1"){
      this.btnaceptado= true;
      this.btnrechazado= false;
    }else if(btn=="btn2"){
      this.btnaceptado= false;
      this.btnrechazado= true;
    }
  }

  changeestadopregunta(estado: string, idePregunta?: number){
    var result = this.listaPregunta?.filter(y=>y.idePregunta==idePregunta)[0];
    result!.respuesta= estado;
  }

  changeobservacion(event: any, idePregunta?: number){
    var result = this.listaPregunta?.filter(y=>y.idePregunta==idePregunta)[0];
    result!.observacion= event.target.value;
  }

  changestepper(stepper: any){
    this.currentTab = stepper._selectedIndex;
  }

  guardar(){
    let id = this.form.value['idePreDonante'];
    let submit = true;
    let $estado = this.CodEstado;

    if(id==null || id=="" || id==0){
      submit = false;
      this.currentTab = 0;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','El código al que hace referencia no existe');
    }
    else if($estado=="0"){
      submit = false;
      this.currentTab = 0;
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Seleccione un estado APTO/NO APTO');
    }

    if(submit){
      let model = new Entrevista();

      model.idePreDonante= this.form.value['idePreDonante'];
      model.codigo= this.Codigo;
      model.fechaMed= this.form.value['fechaMed'];
      model.observacionesMed= this.form.value['observacionesMed'];
      model.codEstado= this.CodEstado
      model.ideMotivoRec= this.form.value['ideMotivoRec'];
  
      model.listaPregunta = this.listaPregunta;
  
      this.spinner.showLoading();
      this.entrevistaService.guardar(model).subscribe(data=>{
  
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

  limpiar(){
    this.inicializar();
  }

  imprimir(){
   
    let idepredonante = this.form.value['idePreDonante'];

    if(idepredonante == ''){
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
