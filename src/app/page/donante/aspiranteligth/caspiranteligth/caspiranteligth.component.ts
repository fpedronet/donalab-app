import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Distrito } from 'src/app/_model/distrito';
import { Persona } from 'src/app/_model/persona';
import { Predonante } from 'src/app/_model/predonante';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-caspiranteligth',
  templateUrl: './caspiranteligth.component.html',
  styleUrls: ['./caspiranteligth.component.css']
})
export class CaspiranteligthComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService
  ) { }

  /*tabla de encuesta maestra */
  form: FormGroup = new FormGroup({});

  id: number = 0;
  edit: boolean = true;
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  curUser: number = 0;
  curBanco: number = 0;

  tablasMaestras = ['TDoc', 'PAIS', 'DEPA', 'PROV', 'DST', 'GENE', 'ORI', 'CAMP'];
  tbTipoDocu: Combobox[] = [];
  tbPais: Combobox[] = [];
  tbGenero: Combobox[] = [];
  tbOrigen: Combobox[] = [];
  tbCampana: Combobox[] = [];

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

  ngOnInit(): void {
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
      this.curBanco = user.codigobanco;
    }

    this.minDate.setMonth(this.maxDate.getMonth() - 12*80);
    this.listarCombo();    

    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '###', disabled: true}),
      'IdePersona': new FormControl({ value: 0, disabled: false}),
      'TipDocu': new FormControl({ value: '1', disabled: false}),
      'NumDocu': new FormControl({ value: '', disabled: false}),
      'ApPaterno': new FormControl({ value: '', disabled: false}),
      'ApMaterno': new FormControl({ value: '', disabled: false}),
      'Nombres': new FormControl({ value: '', disabled: false}),
      'Sexo': new FormControl({ value: '', disabled: false}),
      'FecNacimiento': new FormControl({ value: null, disabled: false}),
      'CodPais': new FormControl({ value: '', disabled: false}),
      'Celular': new FormControl({ value: '', disabled: false}),
      'Telefono': new FormControl({ value: '', disabled: false}),
      'Correo': new FormControl({ value: '', disabled: false}),
      'IdeOrigen': new FormControl({ value: 0, disabled: false}),
      'IdeCampania': new FormControl({ value: 0, disabled: false}),
      'Fecha': new FormControl({ value: new Date(), disabled: false}),
    });

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.edit = (data["edit"]=='true')? true : false
      this.obtener();
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
        this.tbOrigen = this.obtenerSubtabla(tbCombobox,'ORI');
        this.tbCampana = this.obtenerSubtabla(tbCombobox,'CAMP');
        this.tbPais = this.obtenerSubtabla(tbCombobox,'PAIS');
        var tbDpto: Combobox[] = this.obtenerSubtabla(tbCombobox,'DEPA');
        var tbProv: Combobox[] = this.obtenerSubtabla(tbCombobox,'PROV');
        var tbDist: Combobox[] = this.obtenerSubtabla(tbCombobox,'DST');

        //debugger;

        this.listarDistritos(tbDpto, tbProv, tbDist);
      }
    });
  }

  obtenerSubtabla(tb: Combobox[], cod: string){
    return tb.filter(e => e.codTabla?.trim() === cod);
  }

  listarDistritos(tbDpto: Combobox[], tbProv: Combobox[], tbDist: Combobox[]){
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
    //debugger;
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
    if(d !== undefined && d !== null && d !== '')
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

  obtenerPersona(){
    var tipoDocu = this.form.value['TipDocu'];
    var numDocu = this.form.value['NumDocu'];
    //debugger;

    if(tipoDocu !== '' && numDocu !== ''){
      this.predonanteService.obtenerPersona(0, tipoDocu, numDocu).subscribe(data=>{
        //debugger;
        this.form.patchValue({
          ApPaterno: data.apPaterno,
          ApMaterno: data.apMaterno,
          Nombres: data.primerNombre + ' ' + data.segundoNombre,
          Sexo: data.sexo,
          FecNacimiento: data.fecNacimiento,
          CodPais: data.codPais,
          Celular: data.celular,
          Telefono: data.telefono,
          Correo: data.correo1
        });

        //debugger;

        this.changePais(data.codPais?data.codPais:'');

        this.codDistrito = data.codDistrito?data.codDistrito:'';
        if(this.codDistrito !== ''){
          var distFind = this.distritos.find(e => e.dist?.codigo === this.codDistrito);
          var dist: Distrito = distFind?distFind:new Distrito();
          this.controlDistritos.setValue(dist);
        }
          
      })
    }
  }

  obtener(){
    if(this.id!=0){
      this.spinner.showLoading();
      this.predonanteService.obtener(this.id).subscribe(data=>{

        /*this.form = new FormGroup({
          'nIdGrupo': new FormControl({ value: data.nIdGrupo }),
          'nCodigo': new FormControl({ value: data.nIdGrupo, disabled: true }),
          'cDescripcion': new FormControl({ value: data.cDescripcion, disabled: this.ver})
        });*/
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
    p.codDistrito = this.codDistrito===''?undefined:this.codDistrito;
    p.celular = this.form.value['Celular'];
    p.telefono = this.form.value['Telefono'];
    p.correo1 = this.form.value['Correo'];

    model.idePersona = p.idePersona;
    model.persona = p;

    model.ideBanco = this.curBanco;
    model.ideOrigen = this.form.value['IdeOrigen'];
    model.ideCampania = this.form.value['IdeCampania'];
    model.fecha = this.form.value['Fecha'];
    model.ideUsuReg = this.curUser;
    model.codEstado = 0;

    //debugger;

    this.spinner.showLoading();
    this.predonanteService.guardar(model).subscribe(data=>{
      debugger;
      this.notifier.showNotification(data.typeResponse!,'Mensaje',data.message!);

      if(data.typeResponse==environment.EXITO){
        //this.router.navigate(['/page/grupo']);
        this.spinner.hideLoading();
      }else{
        this.spinner.hideLoading();
      }      
    });
  }

}
