import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { ConfimService } from 'src/app/page/component/confirm/confim.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Distrito } from 'src/app/_model/distrito';
import { Permiso } from 'src/app/_model/permiso';
import { Persona } from 'src/app/_model/persona';
import { PersonaHistorial } from 'src/app/_model/personahistorial';
import { Predonante } from 'src/app/_model/predonante';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import { PoclabService } from 'src/app/_service/poclab.service';
import { PredonanteService } from 'src/app/_service/predonante.service';
import forms from 'src/assets/json/formulario.json';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-caspirante',
  templateUrl: './caspirante.component.html',
  styleUrls: ['./caspirante.component.css']
})
export class CaspiranteComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private confirm : ConfimService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService,
    private configPermisoService : ConfigPermisoService,
    private poclabService: PoclabService,
  ) { }

  /*tabla de encuesta maestra */
  form: FormGroup = new FormGroup({});

  foto?: string =environment.UrlImage + "people.png";
  lector?: string =environment.UrlImage + "lector.png";

  permiso: Permiso = {};

  id: number = 0;
  edit: boolean = true;
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  curUser: number = 0;
  curBanco: number = 0;

  tablasMaestras = ['TDoc', 'PAIS', 'DEPA', 'PROV', 'DST', 'GENE', 'ECV',
  'NCN', 'PRDO', 'OCUPA', 'GINS', 'ORI', 'CAMP', 'TPRO', 'TEXR', 'TDON'];
  tbTipoDocu: Combobox[] = [];
  tbPais: Combobox[] = [];
  tbGenero: Combobox[] = [];
  tbEstCivil: Combobox[] = [];
  tbGraIns: Combobox[] = [];
  tbNacion: Combobox[] = [];
  tbProced: Combobox[] = [];
  tbOcupa: Combobox[] = [];
  tbViajes: string[] = ['', 'Sí', 'No']
  tbOrigen: Combobox[] = [];
  tbCampana: Combobox[] = [];
  tbTipoProced: Combobox[] = [];
  tbTipoExtrac: Combobox[] = [];
  tbTipoDonac: Combobox[] = [];

  muestraPaciente: boolean = false;
  selectedTipoDonacion: string = '';

  muestraDistrito: boolean = false;
  carBuscaDistrito: number = 2;
  nroDistritosMuestra: number = 15;
  distritos: Distrito[] = [];
  distritoColor: string = 'accent'
  filterDistritos: Observable<Distrito[]> | undefined;
  controlDistritos = new FormControl();
  codDistrito: string = '';

  selectedPais: string = '';
  
  maxDate: Date = new Date();
  minDate: Date = new Date();

  textDono: string = 'SÍ DONÓ';
  textNoDono: string = 'NO DONÓ';

  btnEstadoSel: boolean[] = [false, false];
  estadoIni: number = 0;

  muestraSangre: boolean = false;
  abo: string = '';
  rh: string = '';
  colFondo: string = '';
  colLetra: string = '';

  currentTab: number = 0;

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

    //Busca origen y campaña de caché
    var ideOri = localStorage.getItem('IdeOrigen');
    ideOri = ideOri?ideOri:this.curBanco.toString();
    var ideCam = localStorage.getItem('IdeCampania');
    ideCam = ideCam?ideCam:'1';

    //Inicializa componentes del form
    this.listarCombo();
    this.minDate.setMonth(this.maxDate.getMonth() - 12*80);  

    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '#######', disabled: true}),
      'IdePersona': new FormControl({ value: 0, disabled: !this.edit}),
      'TipDocu': new FormControl({ value: '1', disabled: !this.edit}),
      'NumDocu': new FormControl({ value: '', disabled: !this.edit}),
      'ApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'ApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'Nombres': new FormControl({ value: '', disabled: !this.edit}),
      'FecNacimiento': new FormControl({ value: null, disabled: !this.edit}),
      'Edad': new FormControl({ value: '', disabled: !this.edit}),
      'EstadoCivil': new FormControl({ value: '', disabled: !this.edit}),
      'Sexo': new FormControl({ value: '', disabled: !this.edit}),
      'Nacionalidad': new FormControl({ value: '', disabled: !this.edit}),
      'LugarNacimiento': new FormControl({ value: '', disabled: !this.edit}),
      'Procedencia': new FormControl({ value: '', disabled: !this.edit}),
      'CodGradoInstruccion': new FormControl({ value: '', disabled: !this.edit}),
      'CodOcupacion': new FormControl({ value: '', disabled: !this.edit}),
      'Direccion': new FormControl({ value: '', disabled: !this.edit}),
      'CodPais': new FormControl({ value: '', disabled: !this.edit}),
      'Celular': new FormControl({ value: '', disabled: !this.edit}),
      'Telefono': new FormControl({ value: '', disabled: !this.edit}),
      'Correo': new FormControl({ value: '', disabled: !this.edit}),
      'LugarTrabajo': new FormControl({ value: '', disabled: !this.edit}),
      'ViajeSN': new FormControl({ value: '', disabled: !this.edit}),
      'Lugar': new FormControl({ value: '', disabled: !this.edit}),
      'Permanencia': new FormControl({ value: '', disabled: !this.edit}),
      'FechaViaje': new FormControl({ value: null, disabled: !this.edit}),
      'Otros': new FormControl({ value: '', disabled: !this.edit}),
      'CodTipoProcedimiento': new FormControl({ value: '', disabled: !this.edit}),
      'CodTipoExtraccion': new FormControl({ value: '', disabled: !this.edit}),
      'CodTipoDonacion': new FormControl({ value: '', disabled: !this.edit}),
      'IdePaciente': new FormControl({ value: 0, disabled: !this.edit}),
      'PacTipDocu': new FormControl({ value: '', disabled: !this.edit}),
      'PacNumDocu': new FormControl({ value: '', disabled: !this.edit}),
      'PacApPaterno': new FormControl({ value: '', disabled: !this.edit}),
      'PacApMaterno': new FormControl({ value: '', disabled: !this.edit}),
      'PacNombres': new FormControl({ value: '', disabled: !this.edit}),
      'CodEje': new FormControl({ value: '', disabled: !this.edit}),
      'CodParentesco': new FormControl({ value: '', disabled: !this.edit}),
      'IdeOrigen': new FormControl({ value: ideOri, disabled: !this.edit}),
      'IdeCampania': new FormControl({ value: ideCam, disabled: !this.edit}),
      'TipRecep': new FormControl({ value: ideCam, disabled: !this.edit}),
      'Fecha': new FormControl({ value: new Date(), disabled: !this.edit}),
    }); 
  }

  ngAfterViewInit(){
    //Ahora el obtener se llama después de listar distritos
    //this.obtener();
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.aspirantesligth.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  listarCombo(){
    this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser,this.curBanco).subscribe(data=>{
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;

        this.tbTipoDocu = this.obtenerSubtabla(tbCombobox,'TDoc');
        this.tbGenero = this.obtenerSubtabla(tbCombobox,'GENE');
        this.tbEstCivil = this.obtenerSubtabla(tbCombobox,'ECV');
        this.tbNacion = this.obtenerSubtabla(tbCombobox,'NCN');
        this.tbProced = this.obtenerSubtabla(tbCombobox,'PRDO');
        this.tbOcupa = this.obtenerSubtabla(tbCombobox,'OCUPA');
        this.tbGraIns = this.obtenerSubtabla(tbCombobox,'GINS');
        this.tbOrigen = this.obtenerSubtabla(tbCombobox,'ORI');
        this.tbCampana = this.obtenerSubtabla(tbCombobox,'CAMP');
        this.tbPais = this.obtenerSubtabla(tbCombobox,'PAIS');
        this.tbTipoProced = this.obtenerSubtabla(tbCombobox,'TPRO');
        this.tbTipoExtrac = this.obtenerSubtabla(tbCombobox,'TEXR');
        this.tbTipoDonac = this.obtenerSubtabla(tbCombobox,'TDON');
        var tbDpto: Combobox[] = this.obtenerSubtabla(tbCombobox,'DEPA');
        var tbProv: Combobox[] = this.obtenerSubtabla(tbCombobox,'PROV');
        var tbDist: Combobox[] = this.obtenerSubtabla(tbCombobox,'DST');

        //debugger;

        this.listarDistritos(tbDpto, tbProv, tbDist).then(res => {
          this.obtener();
        });
      }
    });
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.codTabla?.trim() === cod);
  }

  async listarDistritos(tbDpto: Combobox[], tbProv: Combobox[], tbDist: Combobox[]){
    return new Promise(async (resolve) => {
      tbDist.sort((a, b) => (a.descripcion === undefined || b.descripcion === undefined) ? 1 : (a.descripcion < b.descripcion ? -1 : (a.descripcion > b.descripcion ? 1 : 0)));
      tbDist.forEach(d => {
        var distrito: Distrito = new Distrito();
        distrito.dist = d;
        distrito.prov = tbProv.find(e => d.codigo?.startsWith(e.codigo!));
        distrito.dpto = tbDpto.find(e => d.codigo?.startsWith(e.codigo!));
        this.distritos.push(distrito);
      });
  
      this.filterDistritos = this.controlDistritos.valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string'?value:value.dist.descripcion)),
        map(name  => (name?this.buscarDistritos(name):[]))
      )

      if(this.distritos.length === 0)
        resolve('error')
      else
        resolve('ok')
    })
  }

  changePais(value: string){
    //debugger;
    this.selectedPais = value;
    this.muestraDistrito = true;
    if(this.selectedPais !== '01'){
      this.codDistrito = '';
      this.distritoColor = 'accent';
      this.muestraDistrito = false;
    }
  }

  changeDonacion(value: string){
    //debugger;
    this.selectedTipoDonacion = value;
    this.muestraPaciente = false;
    if(this.selectedTipoDonacion === '002' || this.selectedTipoDonacion === '004'){
      this.muestraPaciente = true;
    }
  }

  buscarDistritos(name: string): Distrito[]{
    this.distritoColor = 'accent';
    this.codDistrito = '';
    var results: Distrito[] = [];
    //debugger;
    if(name.length >= this.carBuscaDistrito){
      var filtro = name.toLowerCase();
      results = this.distritos.filter(e => e.dist?.descripcion?.toLowerCase().includes(filtro));
    }    
    return results.slice(0,this.nroDistritosMuestra);
  }

  mostrarDistrito(d: Distrito): string{
    //debugger;
    var result = '';
    if(d !== undefined && d !== null && d !== '' && d.dist?.descripcion !== '')
      result = d.dist?.descripcion! + ', ' + d.prov?.descripcion! + ', ' + d.dpto?.descripcion!;
    return result;
  }

  changeDistrito(event: any){
    var distrito = event.option.value;
    if(distrito !== undefined){
      this.distritoColor = 'primary';
      this.codDistrito = distrito.dist.codigo;
    }
    //debugger;
  }

  changeEstado(index: number){
    //Si el que aprieto está apagado
    if(!this.btnEstadoSel[index]){
      //Apaga el otro si eeste está prendindo
      if(this.btnEstadoSel[1-index]){
        this.btnEstadoSel[1-index] = false;
      }      
      this.btnEstadoSel[index] = true;
    }
    //Si el que aprieto está prendido
    else{
      //Si es nuevo o estaba pendiente podrá deseleccionar
      if(this.id === 0 || this.estadoIni == 0){
        this.btnEstadoSel[index] = false;
      }
      else{
        console.log('No se puede deseleccionar cuando ya no está pendiente')
      }
    }
  }

  obtenerPersonaEnter(key: number, esPaciente: boolean = false){
    if(key === 13){
      this.obtenerPersona(undefined, esPaciente);
    }
  }

  obtenerPersona(e?: Event, esPaciente: boolean = false){
    //console.log(e);
    e?.preventDefault(); // Evita otros eventos como blur   
    
    var tipoDocu = esPaciente?this.form.value['PacTipDocu']:this.form.value['TipDocu'];
    var numDocu = esPaciente?this.form.value['PacNumDocu']:this.form.value['NumDocu'];
    
    //debugger;

    if(this.validaDocumento(tipoDocu, numDocu)){
      this.predonanteService.obtenerPersona(0, tipoDocu, numDocu).subscribe(data=>{
        //Verifica si existe en BD
        var formPersona = esPaciente?this.form.value['IdePaciente']:this.form.value['IdePersona'];

        if(data!== undefined && data.idePersona !== 0){
          //No carga repetidos (eficiencia)          
          if(formPersona !== data.idePersona)
            this.muestraDatosPersona(data, esPaciente);
        }
        else{
          //Busca en Poclab
          if(tipoDocu === '1'){
            
            this.poclabService.obtenerPersona(tipoDocu, numDocu).subscribe(dataP=>{
              if(dataP!== undefined && dataP.nIdePersona !== 0){
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
                  this.muestraDatosPersona(p, esPaciente);
                }                  
              }                
              else
                this.reiniciaPersona();
            })
          }
          else
            this.reiniciaPersona();
        }
      })
    }
    else{
      this.reiniciaPersona();
    }
  }

  muestraDatosPersona(data: Persona, esPaciente: boolean = false){
    //debugger;
    //Ocupación por defecto
    if(data.codOcupacion === undefined || !this.tbOcupa.find(e => e.codigo === data.codOcupacion?.toString()))
      data.codOcupacion = '111';

    if(esPaciente){
      this.form.patchValue({
        IdePaciente: data.idePersona,
        PacTipDocu: data.tipDocu,
        PacNumDocu: data.numDocu,
        PacApPaterno: data.apPaterno,
        PacApMaterno: data.apMaterno,
        PacNombres: data.primerNombre + ' ' + data.segundoNombre
      });
    }
    else{
      this.form.patchValue({
        IdePersona: data.idePersona,
        TipDocu: data.tipDocu,
        NumDocu: data.numDocu,
        ApPaterno: data.apPaterno,
        ApMaterno: data.apMaterno,
        Nombres: data.primerNombre + ' ' + data.segundoNombre,
        Sexo: data.sexo,
        FecNacimiento: data.fecNacimiento,
        CodPais: data.codPais,
        Celular: data.celular,
        Telefono: data.telefono,
        Correo: data.correo1,
        //Datos completos
        Edad: data.edad,
        EstadoCivil: data.estadoCivil,
        Nacionalidad: data.nacionalidad,
        LugarNacimiento: data.lugarNacimiento,
        Procedencia: data.procedencia,
        CodGradoInstruccion: data.codGradoInstruccion,
        CodOcupacion: data.codOcupacion,
        Direccion: data.direccion,
        LugarTrabajo: data.lugarTrabajo
      });
    }

    if(!esPaciente){
      this.cambiaPaisDistrito(data.codPais, data.codDistrito);
      this.obtieneHistorial(data.idePersona, false);
    }    
  }

  obtieneHistorial(idPersona: number = 0, muestraErrores: boolean){
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
            
            this.abo = tipoSangre.dato1?tipoSangre.dato1:'';
            this.rh = tipoSangre.dato2?tipoSangre.dato2:'';
            this.colFondo = tipoSangre.colorFondo?tipoSangre.colorFondo:'';
            this.colLetra = tipoSangre.colorLetra?tipoSangre.colorLetra:'';
            this.muestraSangre = true;
          }

          if(muestraErrores){
            //Posible error
            var hist2 = historial.filter(e => e.tipo?e.tipo >= 2:false);
            if(hist2 !== undefined){
              var errores: PersonaHistorial[] = hist2;
              var msgError = errores[errores.length-1].dato1;
              //console.log(msgError);
              if(msgError){
                this.confirm.openConfirmDialog(true, msgError).afterClosed().subscribe(res =>{
                  //Ok
                  if(res){
                    this.reiniciaPersona();
                  }
                });
              }                  
            }
          }          
        }

      });
    }
  }

  validaDocumento(tipoDocu: string, numDocu: string){
    if(tipoDocu === '' || numDocu === '')
      return false;

    //DNI
    if(tipoDocu === '1' && numDocu.length !== 8)
      return false;

    //RUC
    if(tipoDocu === '6' && numDocu.length !== 11)
      return false;

    //CEXT / PASS
    if((tipoDocu === '4' || tipoDocu === '7') && numDocu.length > 12)
      return false;
    
    return true;
  }

  reiniciaPersona(esPaciente: boolean = false){
    if(esPaciente){
      this.form.patchValue({
        IdePaciente: 0,
        //PacTipDocu: '1',
        PacNumDocu: '',
        PacApPaterno: '',
        PacApMaterno: '',
        PacNombres: ''
      });
    }
    else{
      this.muestraSangre = false;
      this.muestraDistrito = false;
      this.controlDistritos.setValue(new Distrito());
      this.codDistrito = '';

      this.form.patchValue({
        IdePersona: 0,
        //TipDocu: '1',
        NumDocu: '',
        ApPaterno: '',
        ApMaterno: '',
        Nombres: '',
        Sexo: '',
        FecNacimiento: null,
        CodPais: '',
        Celular: '',
        Telefono: '',
        Correo: '',
        //Datos completos
        Edad: '',
        EstadoCivil: '',
        Nacionalidad: '',
        LugarNacimiento: '',
        Procedencia: '',
        CodGradoInstruccion: '',
        CodOcupacion: '',
        Direccion: '',
        LugarTrabajo: ''
      });
    }    
  }

  cambiaPaisDistrito(codPais: string = '', codDistrito: string = ''){
    this.changePais(codPais?codPais:'');
    //debugger;

    this.codDistrito = codDistrito?codDistrito:'';
    if(this.codDistrito !== ''){
      var distFind = this.distritos.find(e => e.dist?.codigo === this.codDistrito);
      if(distFind !== undefined){
        var distrito: Distrito = distFind;
        this.distritoColor = 'primary';
        this.controlDistritos.setValue(distrito);
      }
      else{
        this.distritoColor = 'accent';
        this.controlDistritos.setValue(new Distrito());
      }
    }
  }

  obtener(){
    if(this.id!=0){
      this.currentTab = 1;

      /*var c = document.getElementById('buttonsDonacion');
      if(c) window.scrollTo(0, c.scrollHeight);*/

      this.spinner.showLoading();
      this.predonanteService.obtener(this.id).subscribe(data=>{
        //debugger;
        var p = data.persona;
        if(p !== undefined){
          this.form.patchValue({
            IdePersona: p.idePersona,
            Codigo: data.codigo,
            TipDocu: p.tipDocu,
            NumDocu: p.numDocu,
            ApPaterno: p.apPaterno,
            ApMaterno: p.apMaterno,
            Nombres: p.primerNombre + ' ' + p.segundoNombre,
            Sexo: p.sexo,
            FecNacimiento: p.fecNacimiento,
            CodPais: p.codPais,
            Celular: p.celular,
            Telefono: p.telefono,
            Correo: p.correo1,
            IdeOrigen: data.ideOrigen?.toString(),
            IdeCampania: data.ideCampania?.toString(),
            Fecha: data.fecha
          });

          //Deshabilita tipo de documento y documento si existe la postulación
          //Ya no (no deja enviar tipo de documento y documento)
          //this.form.get('TipDocu')?.disable();
          //this.form.get('NumDocu')?.disable();

          this.obtieneHistorial(p.idePersona, false);

          var codEstado = data.codEstado?data.codEstado:0;
          this.estadoIni = codEstado;
          //debugger;

          this.btnEstadoSel = [false, false];
          if(codEstado > 0){
            this.btnEstadoSel[codEstado-1] = true;
          }

          this.cambiaPaisDistrito(p.codPais, p.codDistrito);
        }
        this.spinner.hideLoading();
      });
    }
  }

  guardar(){
    let model = new Predonante();

    //debugger;
    model.idePreDonante = this.id
    model.codigo = this.form.value['Codigo'];;

    let p = new Persona();
    p.idePersona = this.form.value['IdePersona'];;
    p.tipDocu = this.form.value['TipDocu'];
    p.numDocu = this.form.value['NumDocu'];
    p.apPaterno = this.form.value['ApPaterno'];
    p.apPaterno = p.apPaterno?.toUpperCase();
    p.apMaterno = this.form.value['ApMaterno'];
    p.apMaterno = p.apMaterno?.toUpperCase();
    var nombres: string = this.form.value['Nombres'];
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
    p.sexo = this.form.value['Sexo'];
    p.fecNacimiento = this.form.value['FecNacimiento'];
    p.codPais = this.form.value['CodPais'];
    p.codPais = p.codPais===''?undefined:p.codPais;
    p.codDistrito = this.codDistrito===''?undefined:this.codDistrito;
    p.celular = this.form.value['Celular'];
    p.telefono = this.form.value['Telefono'];
    p.correo1 = this.form.value['Correo'];
    //Datos completos
    p.edad = this.form.value['Edad'];
    p.estadoCivil = this.form.value['EstadoCivil'];
    p.nacionalidad = this.form.value['Nacionalidad'];
    p.lugarNacimiento = this.form.value['LugarNacimiento'];
    p.procedencia = this.form.value['Procedencia'];
    p.codGradoInstruccion = this.form.value['CodGradoInstruccion'];
    p.codOcupacion = this.form.value['CodOcupacion'];
    p.direccion = this.form.value['Direccion'];
    p.lugarTrabajo = this.form.value['LugarTrabajo'];

    model.idePersona = p.idePersona;
    model.persona = p;

    model.ideBanco = this.curBanco;
    model.ideOrigen = this.form.value['IdeOrigen'];
    model.ideCampania = this.form.value['IdeCampania'];
    model.fecha = this.form.value['Fecha'];
    model.ideUsuReg = this.curUser;
    model.codEstado = !this.btnEstadoSel[0]&&!this.btnEstadoSel[1]?0:(this.btnEstadoSel[0]?1:2);

    //debugger;

    this.spinner.showLoading();
    this.predonanteService.guardar(model).subscribe(data=>{
      //debugger;
      this.notifier.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        localStorage.setItem('IdeOrigen',model.ideOrigen===undefined?'':model.ideOrigen.toString());
        localStorage.setItem('IdeCampania',model.ideCampania===undefined?'':model.ideCampania.toString());
        this.form.patchValue({
          Codigo: data.codigo
        })
        this.router.navigate(['/page/donante/aspirantelight']);
        this.spinner.hideLoading();
      }else{
        this.spinner.hideLoading();
      }      
    });
  }

  subirFoto(fileInput: Event){
    let file = (<HTMLInputElement>fileInput.target).files?[0]:undefined;

    //if(file?.type == "image/jpeg")
  }

}