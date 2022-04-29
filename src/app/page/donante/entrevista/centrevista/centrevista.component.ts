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

    this.spinner.showLoading();
    this.reporteService.rptficha(idepredonante).subscribe(data=>{
      console.log(data);
   /*
      // this.rptetiqueta.
      this.rptetiqueta.nombres = data.nombres;
      this.rptetiqueta.documento = data.documento!;
      this.rptetiqueta.sexo = data.sexo;
      this.rptetiqueta.hematocritos = data.hematocrito;
      this.rptetiqueta.vFecNacimiento = data.vFecNacimiento;
      this.rptetiqueta.edad = data.edad;
      this.rptetiqueta.grupo = data.grupo;
      this.rptetiqueta.mostrarRh = data.mostrarRh;
      this.rptetiqueta.codMuestra = data.codMuestra;
      this.rptetiqueta.vFecha = data.vFecha;

      let code =(this.rptetiqueta.codMuestra==null || this.rptetiqueta.codMuestra=="")? "" : this.rptetiqueta.codMuestra!.toString();
      if(code!=""){
        JsBarcode("#barcode", code, {        
          lineColor: "#000",
          width: 2,
          height: 40,
          displayValue: false
        });

        setTimeout(function(){
          const printContents = document.getElementById('imprimir-seccion')!.innerHTML;
              const popupWin = window.open('', '_blank', 'top=0,left=0,height=1000,width=1000')!;
              popupWin.document.open();
              popupWin.document.write(`
                  <html>
                      <head>
                          <title>Print tab</title>
                        
                      </head>
                      <body onload="window.print(); window.close()">
                          ${printContents}
                      </body>
                  </html>
                  `
              );
            popupWin.document.close();
        },200);
      }else{
        this.notifierService.showNotification(2,'Mensaje',"No se encontro la donación");
      }

      this.spinner.hideLoading();
      
   */
    });
  }
}
