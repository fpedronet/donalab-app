import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Permiso } from 'src/app/_model/permiso';
import { PoclabService } from 'src/app/_service/apiexterno/poclab.service';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { environment } from 'src/environments/environment';
import forms from 'src/assets/json/formulario.json';
import { SolicitudService } from 'src/app/_service/paciente/solicitud.service';
import { Persona } from 'src/app/_model/donante/persona';
import { Solicitud, SolicitudPedido, SolicitudPrueba } from 'src/app/_model/paciente/solicitud';
import { PredonanteService } from 'src/app/_service/donante/predonante.service';
import { PersonaHistorial } from 'src/app/_model/donante/personahistorial';
import jsonTranPrev from 'src/assets/json/solicitud/tranprev.json';
import { Unidade } from 'src/app/_model/donante/unidade';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-csolicitud',
  templateUrl: './csolicitud.component.html',
  styleUrls: ['./csolicitud.component.css']
})
export class CsolicitudComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService: NotifierService,
    private confirm : ConfimService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private solicitudService: SolicitudService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
    private poclabService: PoclabService,
  ) { }

  /*tabla de encuesta maestra */
  form: FormGroup = new FormGroup({});

  //foto?: string =environment.UrlImage + "people.png";
  lector?: string =environment.UrlImage + "lector.png";

  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;
  loading = true;

  curUser: number = 0;
  curBanco: number = 0;

  tablasMaestras = ['TDoc', 'GENE', 'PROC', 'SERV', 'DIAG', 'MEDI', 'PRIO', 'ADCN', 'RADP', 'HEMO', 'PRUE', 'COBLI'];
  tbTipoDocu: Combobox[] = [];
  tbGenero: Combobox[] = [];
  tbProced: Combobox[] = [];
  tbServi: Combobox[] = [];
  tbDiagno: Combobox[] = [];
  tbMedico: Combobox[] = [];
  tbTransPrev: Combobox[] = [];
  tbPriori: Combobox[] = [];
  tbAdicional: Combobox[] = [];
  tbReacAdver: Combobox[] = [];
  tbHemocom: Combobox[] = [];
  tbPrueba: Combobox[] = [];
  tbObligatorio: Combobox[] = [];

  muestraPaciente: boolean = false;
  selectedTipoDonacion: string = '';
  idPaciente: number = 0;
  pacientePoclab: boolean = false;

  idPersona: number = 0;

  fechaNac: Date | null = null;
  
  maxDate: Date = new Date();
  minDate: Date = new Date();

  fechaMostrar?: string = '';

  btnEstadoSel: boolean[] = [false, false];
  estadoIni: number = 0;

  listaUnidade: Unidade[] = [];

  listaHemocom: SolicitudPedido[] = [];
  listaPruebas: SolicitudPrueba[] = [];

  //Tipo Sangre
  muestraSangre: boolean = false;
  abo: string = '';
  rh: string = '';
  colFondo: string = '';
  colLetra: string = '';

  fotoUrl: string = '';
  fotoError: string = '';

  perOblig: boolean[] = [
    false, false, false, false, false, false, false, false, false, false, false
  ]
  offsetOblig = 21;

  @ViewChild(MatStepper)
  stepper!: MatStepper;

  ngOnInit(): void {
    
    //Extrae permisos
    this.obtenerpermiso();

    //Obtiene parámetros de URL
    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]==undefined) ? true : ((data["edit"]=='true') ? true : false)      
    });

    //atributos de tokeN usuario
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
      this.curBanco = user.codigobanco;
    }

    //Inicializa componentes del form    
    this.minDate.setMonth(this.maxDate.getMonth() - 12*120);  

    this.form = new FormGroup({
      'FechaSol': new FormControl({ value: new Date(), disabled: !this.edit}),
      'CodSolicitud': new FormControl({ value: '', disabled: !this.edit}),
      'IdeEstado': new FormControl({ value: '', disabled: !this.edit}),
      'Estado': new FormControl({ value: '', disabled: !this.edit}),
      //Persona
      'IdePersona': new FormControl({ value: 0, disabled: !this.edit}),
      'TipDocu': new FormControl({ value: '1', disabled: !this.edit}),
      'NumDocu': new FormControl({ value: '', disabled: !this.edit}),
      'DocAdic': new FormControl({ value: '', disabled: !this.edit}),
      'ApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'ApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'Nombres': new FormControl({ value: '', disabled: !this.edit}),
      'FecNacimiento': new FormControl({ value: null, disabled: !this.edit}),
      'Sexo': new FormControl({ value: '', disabled: !this.edit}),
      //
      'CodProcedencia': new FormControl({ value: '', disabled: !this.edit}),
      'CodServicio': new FormControl({ value: '', disabled: !this.edit}),
      'CodDiagnostico': new FormControl({ value: '', disabled: !this.edit}),
      'CodMedico': new FormControl({ value: '', disabled: !this.edit}),
      'Medico': new FormControl({ value: '', disabled: !this.edit}),
      'Cama': new FormControl({ value: '', disabled: !this.edit}),
      'CodTransPrev': new FormControl({ value: '', disabled: !this.edit}),
      'CodPrioridad': new FormControl({ value: '', disabled: !this.edit}),
      'Cuenta': new FormControl({ value: '', disabled: !this.edit}),
      'CodAdicional': new FormControl({ value: '', disabled: !this.edit}),
      'CodReaccAdv': new FormControl({ value: null, disabled: !this.edit}),
      'Observaciones': new FormControl({ value: '', disabled: !this.edit})
    });

    this.listarCombo().then(res => {
        this.obtener();
      }
    );
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.aspirante.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  async listarCombo(){
    return new Promise(async (resolve) => {

      this.spinner.showLoading();
      this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser,this.curBanco).subscribe(data=>{
        if(data === undefined){
          this.notifierService.showNotification(0,'Mensaje','Error en el servidor');
        }
        else{
          var tbCombobox: Combobox[] = data.items;

          this.tbTipoDocu = this.obtenerSubtabla(tbCombobox,'TDoc');
          this.tbGenero = this.obtenerSubtabla(tbCombobox,'GENE');
          this.tbProced = this.obtenerSubtabla(tbCombobox,'PROC');
          this.tbServi = this.obtenerSubtabla(tbCombobox,'SERV');
          this.tbDiagno = this.obtenerSubtabla(tbCombobox,'DIAG');
          this.tbMedico = this.obtenerSubtabla(tbCombobox,'MEDI');
          this.tbTransPrev = this.completarCombo(jsonTranPrev);
          this.tbPriori = this.obtenerSubtabla(tbCombobox,'PRIO');
          this.tbAdicional = this.obtenerSubtabla(tbCombobox,'ADCN');
          this.tbReacAdver = this.obtenerSubtabla(tbCombobox,'RADP');
          this.tbHemocom = this.obtenerSubtabla(tbCombobox,'HEMO');
          this.tbPrueba = this.obtenerSubtabla(tbCombobox,'PRUE');
          this.tablaHemocom(this.tbHemocom);

          this.tbObligatorio = this.obtenerSubtabla(tbCombobox,'COBLI');          
          this.camposObligatorios(this.tbObligatorio);

          this.tbPrueba = this.tbPrueba.sort((a, b) => a.descripcion!.localeCompare(b.descripcion!));

          //Valores por defecto de tipo proc. y extracción
          /*this.form.patchValue({
            CodTipoProcedimiento: this.tbTipoProced[0].codigo
          });
          this.changeTipoProced(this.tbTipoProced[0].codigo)*/

          this.spinner.hideLoading();
          
          resolve('ok')
        }
      });
    });
  }

  tablaHemocom(tb: Combobox[]){
    this.listaHemocom = [];
    tb.forEach(he => {
      this.listaHemocom.push(new SolicitudPedido(parseInt(he.codigo!), he.descripcion));
    });
  }

  camposObligatorios(tb: Combobox[]){
    tb.forEach(e => {
      let cod = e.codigo === undefined ? 0 : parseInt(e.codigo);
      let oblig = e.detalles1 === undefined ? false : e.detalles1 === 'SI';
      if(oblig && cod >= this.offsetOblig){
        this.perOblig[cod - this.offsetOblig]
      }
    });
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.codTabla?.trim() === cod);
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

  obtenerPersonaEnter(key: number, esPaciente: boolean = false){
    if(key === 13){
      this.obtenerPersona();
    }
  }

  obtenerPersona(e?: Event){
    //console.log(e);
    e?.preventDefault(); // Evita otros eventos como blur   
    
    var tipoDocu = this.form.value['TipDocu'];
    var numDocu = this.form.value['NumDocu'];

    var validacion = this.validaDocumento(tipoDocu, numDocu);
    if(validacion === ''){
      this.predonanteService.obtenerPersona(0, tipoDocu, numDocu).subscribe(data=>{
        //Verifica si existe en BD
        var formPersona = this.form.value['IdePersona'];

        if(data!== undefined && data.idePersona !== 0){
          //No carga repetidos (eficiencia)          
          if(formPersona !== data.idePersona){
            this.idPersona = 0;
            this.muestraDatosPersona(data);
            this.idPersona = data.idePersona!==undefined?data.idePersona:0;
          }            
        }
        else{
          //Busca en Poclab
          if(tipoDocu === '1'){            
            this.poclabService.obtenerPersona(tipoDocu, numDocu).subscribe(dataP=>{
              if(dataP!== undefined && dataP!== null && dataP.nIdePersona !== 0){
                if(formPersona !== dataP.nIdePersona){
                  //Convierte datos
                  //debugger;
                  var p = new Persona();
                  p.tipDocu = '1';
                  p.numDocu = dataP.vDocumento;
                  p.idePersona = 0;
                  p.apPaterno = dataP.vApePaterno;
                  p.apMaterno = dataP.vApeMaterno;
                  p.primerNombre = dataP.vPrimerNombre;
                  p.segundoNombre = dataP.vSegundoNombre;
                  p.sexo = dataP.vSexo;
                  p.fecNacimiento = dataP.dteNacimiento;

                  if(p.fecNacimiento !== undefined && p.fecNacimiento !== null)
                    this.fechaNac = p.fecNacimiento;
                  else
                    this.fechaNac = null;

                  var codPais = dataP.vCodPais;
                  if(codPais === 'PER'){
                    p.codPais = '01';
                  }
                  else{
                    p.codPais = dataP.vCodPais;
                  }                  
                  p.codDepartamento = dataP.vCodRegion;
                  p.codProvincia = dataP.vCodProvincia;
                  p.codDistrito = dataP.vCodDistrito;
                  p.correo1 = dataP.vEmail;
                  p.telefono = dataP.vTelefono1;
                  this.muestraDatosPersona(p);
                }                  
              }
            })
          }
        }
      })
    }
    else{
      if(validacion !== 'El tipo de documento y el documento no pueden estar vacíos')
        this.notifierService.showNotification(2,'Mensaje',validacion);
      this.reiniciaPersona();
    }
  }

  muestraDatosPersona(data: Persona){
    this.form.patchValue({
      IdePersona: data.idePersona,
      TipDocu: data.tipDocu,
      NumDocu: data.numDocu,
      DocAdic: data.docAdic1,
      ApPaterno: data.apPaterno,
      ApMaterno: data.apMaterno,
      Nombres: data.primerNombre + ' ' + data.segundoNombre,
      Sexo: data.sexo,
      FecNacimiento: data.fecNacimiento
    });

    this.obtieneSangre(data.idePersona);
  }

  obtieneSangre(idPersona: number = 0){
    if(idPersona !== 0){
      this.predonanteService.obtenerHistorial(idPersona).subscribe(dataH=>{
        //debugger;
        if(dataH!==undefined){
          var historial: PersonaHistorial[] = dataH.items;

          //Tipo de sangre
          var hist1 = historial.find(e => e.tipo === 1);
          this.muestraSangre = false;
          if(hist1 !== undefined){
            var tipoSangre: PersonaHistorial = hist1;
            
            this.abo = tipoSangre.dato1!==undefined?tipoSangre.dato1:'';
            this.rh = tipoSangre.dato2!==undefined?tipoSangre.dato2:'';
            this.colFondo = tipoSangre.colorFondo!==undefined?tipoSangre.colorFondo:'';
            this.colLetra = tipoSangre.colorLetra!==undefined?tipoSangre.colorLetra:'';
            this.muestraSangre = true;
          }    
        }
      });
    }
  }

  validaDocumento(tipoDocu: string, numDocu: string){
    if(tipoDocu === '' || numDocu === '')
      return 'El tipo de documento y el documento no pueden estar vacíos';

    var noEsNro = !this.esEntero(numDocu);
    
    //DNI
    if(tipoDocu === '1'){
      if(numDocu.length !== 8)
        return 'El DNI debe tener 8 dígitos';
      if(noEsNro)
        return 'El DNI debe debe contener solo números';
    }

    //RUC
    if(tipoDocu === '6'){
      if(numDocu.length !== 11)
        return 'El RUC debe tener 11 dígitos';
      if(noEsNro)
        return 'El RUC debe debe contener solo números';
    }

    //CEXT
    if(tipoDocu === '4' && numDocu.length > 12)
      return 'El CEXT no puede exceder 12 dígitos';

    //PASS
    if(tipoDocu === '7' && numDocu.length > 12)
      return 'El PASS no puede exceder 12 dígitos';
    
    return '';
  }

  esEntero(cadena: string){
    const regex = /^[0-9]+$/;
    return regex.test(cadena);
  }

  cambiaFechaNac(dateStr: string){
    var arrDate = this.separarFecha(dateStr);
    if(arrDate.length === 0)
      this.fechaNac = null;
    else{
      var d = new Date(arrDate[2], arrDate[1]-1, arrDate[0]);
      //console.log(this.minDate + ' < ' + d + ' < ' + this.maxDate);
      if(d < this.minDate || d > this.maxDate)
        this.fechaNac = null;
    }
  }

  separarFecha(cad: string){
    var arrStr: string[] = [];
    var arr: number[] = [];
    arrStr = cad.split('/');
    if(arrStr.length !== 3)
      return arr;
    else{
      for (let str of arrStr){
        let num = parseInt(str);
        if(num === null){
          arr = [];
          break;
        }
        else
          arr.push(num)
      }
      return arr;
    }
  }

  reiniciaPersona(){
      this.muestraSangre = false;

      this.form.patchValue({
        IdePersona: 0,
        //TipDocu: '1',
        NumDocu: '',
        ApPaterno: '',
        ApMaterno: '',
        Nombres: '',
        Sexo: '',
        FecNacimiento: null,
        DocAdic: ''
      });
      this.fechaNac = null;
  }

  obtener(){
    if(this.id!=0){
      this.spinner.showLoading();
      this.solicitudService.obtener(this.id).subscribe(data=>{
        var p = data.persona;
        
        if(p !== undefined){

          this.idPersona = p.idePersona===undefined?0:p.idePersona!;
          if(this.idPersona === 0)
            this.reiniciaPersona();
          else
            this.muestraDatosPersona(data.persona!);

          //this.codigo = data.codSolicitud===undefined?'':data.codSolicitud.toString();
          this.form.patchValue({
            FechaSol: data.fecha,
            CodSolicitud: data.codSolicitud,
            IdeEstado: data.ideEstado,
            Estado: data.estado,
            CodProcedencia: data.codProcedencia,
            CodServicio: data.codServicio,
            CodDiagnostico: data.codDiagnostico,
            CodMedico: data.codMedico,
            Medico: data.medico,
            Cama: data.cama,
            CodTransPrev: data.codTransPrev,
            CodPrioridad: data.codPrioridad,
            Cuenta: data.cuenta,
            CodAdicional: data.codAdicional,
            CodReaccAdv: data.codReaccAdv,
            Observaciones: data.observaciones            
          });

          this.fechaMostrar = data.vFecha;

          if(p.fecNacimiento !== undefined && p.fecNacimiento !== null)
            this.fechaNac = p.fecNacimiento;
          else
            this.fechaNac = null;

          this.rellenaHemocom(data.listaPedidos);
          this.listaPruebas = data.listaPruebas!
        }
        this.spinner.hideLoading();
      });
    }
  }

  rellenaHemocom(pedidos?: SolicitudPedido[]){
    if(pedidos !== undefined){
      pedidos.forEach(p => {
        var hemo = this.listaHemocom.find(e => e.ideHemocomponente === p.ideHemocomponente);
        if(hemo !== undefined){
          hemo.traspasarCampos(p);
        }
      });      
    }    
  }

  guardar(){
    if(this.listaHemocom.find(e => e.cant! > 0) === undefined){
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingrese las unidades a solicitar.');
    }
    else{
      if(this.id !== 0){
        let estado = parseInt(this.form.value['IdeEstado']);
        if(estado > 1){ //Unidades reservadas o enviadas
          if(estado <= 3){
            if(!this.permiso.actualizarInclusoEnviada && !this.permiso.actualizarInclusoFinalizada)
              this.notifierService.showNotification(environment.ALERT,'Mensaje','La solicitud ya tiene unidades Reservadas o Enviadas, no se puede modificar.');
          }
          else if(estado <= 5){
            if(!this.permiso.actualizarInclusoFinalizada){
              this.notifierService.showNotification(environment.ALERT,'Mensaje','La solicitud se encuentra ' + this.form.value['Estado'] + ', no se puede modificar.');
            }
          }
        }
        else{
          this.confirm.openConfirmDialog(false, 'Confirma actualizar los datos de la solicitud.').afterClosed().subscribe(res =>{
            //Ok
            if(res){
              //console.log('Sí');
              this.$guardar();
            }
            else{
              //console.log('No');
            }
          });
        }
      }
      else{
        this.confirm.openConfirmDialog(false, 'Confirma crear la Solicitud de Transfusión.').afterClosed().subscribe(res =>{
          //Ok
          if(res){
            //console.log('Sí');
            this.$guardar();
          }
          else{
            //console.log('No');
          }
        });
      }
    }    
  }

  $guardar(){
    let model = new Solicitud();

    //debugger;
    model.ideSolicitud = this.id
    let p = new Persona();
    p.idePersona = this.form.value['IdePersona'];
    p.tipDocu = this.form.value['TipDocu'];
    p.numDocu = this.form.value['NumDocu'];
    p.docAdic1 = this.form.value['DocAdic']
    p.apPaterno = this.form.value['ApPaterno'];
    p.apPaterno = p.apPaterno?.toUpperCase();
    p.apMaterno = this.form.value['ApMaterno']; 
    p.apMaterno = p.apMaterno?.toUpperCase();
    this.asignarNombres(p, this.form.value['Nombres']);    
    p.sexo = this.form.value['Sexo'];
    p.fecNacimiento = this.form.value['FecNacimiento'];

    model.idePersona = p.idePersona;
    model.persona = p;

    model.fecha = this.form.value['FechaSol'];
    model.codProcedencia = this.form.value['CodProcedencia'];
    model.codServicio = this.form.value['CodServicio'];
    model.codDiagnostico = this.form.value['CodDiagnostico'];
    model.codMedico = this.form.value['CodMedico'];
    
    if(model.codMedico === ''){
      model.medico = ''
    }
    else{
      model.medico = this.tbMedico.find(e => e.codigo === model.codMedico)?.descripcion;
    }

    model.medico = this.form.value['Medico'];
    model.cama = this.form.value['Cama'];
    model.codTransPrev = this.form.value['CodTransPrev'];
    model.codPrioridad = this.form.value['CodPrioridad'];
    model.cuenta = this.form.value['Cuenta'];
    model.codAdicional = this.form.value['CodAdicional'];
    model.codReaccAdv = this.form.value['CodReaccAdv'];
    model.observaciones = this.form.value['Observaciones'];

    model.listaPedidos = this.listaHemocom.filter(e => e.cant! > 0);
    model.listaPruebas = this.listaPruebas;

    this.guardaSolicitud(model);
  }

  guardaSolicitud(model: Solicitud){
    this.spinner.showLoading();
    this.solicitudService.guardar(model).subscribe(data=>{
      //debugger;
      if(data.typeResponse==environment.EXITO){
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
        this.form.patchValue({
          CodigoSol: data.codigo
        })
        //if(data.codigo !== undefined && data.codigo !== null)
        //  this.codigo = data.codigo;
        this.router.navigate(['/page/paciente/solicitud']);
        this.spinner.hideLoading();
      }
    });
  }

  asignarNombres(p: Persona, nombres: string){
    nombres = nombres.toUpperCase();
    var posEspacio = nombres.indexOf(' ');
    if(posEspacio !== -1){
      p.primerNombre = nombres.substring(0, posEspacio);
      p.segundoNombre = nombres.substring(posEspacio+1, nombres.length);
    }
    else{
      p.primerNombre = nombres;
      p.segundoNombre = '';
    }
  }

  getControlLabel(type: string){
    return this.form.controls[type].value;
  }

  limpiar(){
    this.id = 0;

    this.reiniciaPersona();

    this.form.patchValue({
      FechaSol: new Date(),
      //Persona
      IdePersona: 0,
      TipDocu: '1',
      NumDocu: '',
      DocAdic: '',
      ApPaterno: '',
      ApMaterno: '',
      Nombres: '',
      FecNacimiento: null,
      Sexo: '',
      //
      CodProcedencia: '',
      CodServicio: '',
      CodDiagnostico: '',
      CodMedico: '',
      Medico: 0,
      Cama: '',
      CodTransPrev: '',
      CodPrioridad: '',
      Cuenta: '',
      CodAdicional: '',
      CodReaccAdv: '',
      Observaciones: ''
    })
  }

  cancelar(){
    if(this.id !== 0){
      let estado = parseInt(this.form.value['IdeEstado']);
      if(estado > 1){ //Unidades reservadas o enviadas
        this.notifierService.showNotification(environment.ALERT,'Mensaje','La solicitud ya tiene unidades Reservadas o Enviadas, no se puede modificar.');
      }
      else{
        this.confirm.openConfirmDialog(false, 'Confirma actualizar los datos de la solicitud.').afterClosed().subscribe(res =>{
          //Ok
          if(res){
            //console.log('Sí');
            this.$cancelar();
          }
          else{
            //console.log('No');
          }
        });
      }
    }
  }

  $cancelar(){
    this.spinner.showLoading();
    this.solicitudService.cancelar(this.id).subscribe(data=>{
      //debugger;
      if(data.typeResponse==environment.EXITO){
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
        this.form.patchValue({
          CodigoSol: data.codigo
        })
        //if(data.codigo !== undefined && data.codigo !== null)
        //  this.codigo = data.codigo;
        this.router.navigate(['/page/paciente/solicitud']);
        this.spinner.hideLoading();
      }
      else{
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
        this.spinner.hideLoading();
      }
    });
  }

  reiniciaUnidad(c: SolicitudPedido){
    if(this.edit){
      c.cant = 0;
      c.alicuota = 0;
      c.observaciones = '';
    }
  }

  reiniciaPrueba(p: SolicitudPrueba){
    if(this.edit){
      this.listaPruebas = this.listaPruebas.filter(e => e.idePrueba !== p.idePrueba)
    }
  }

  selectPrueba(id: string){
    if(this.listaPruebas.find(e => e.idePrueba === parseInt(id)) === undefined){
      var nombre = this.tbPrueba.find(e => e.codigo === id)?.descripcion;
      var prueba = new SolicitudPrueba(parseInt(id), nombre);
      this.listaPruebas.push(prueba)
    }    
  }
}
