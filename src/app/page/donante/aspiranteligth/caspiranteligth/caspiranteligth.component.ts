import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { Distrito } from 'src/app/_model/distrito';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-caspiranteligth',
  templateUrl: './caspiranteligth.component.html',
  styleUrls: ['./caspiranteligth.component.css']
})
export class CaspiranteligthComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private comboboxService: ComboboxService,
    private usuarioService: UsuarioService,
    private predonanteService: PredonanteService
  ) { }

  /*tabla de encuesta maestra */
  form: FormGroup = new FormGroup({});
  id: number = 0;
  ver: boolean = true;
  loading = true;
  existRegistro = false;
  countRegistro = 0;

  curUser: number = 0;

  tablasMaestras = ['TDoc', 'PAIS', 'DEPA', 'PROV', 'DST'];
  tbTipoDocu: Combobox[] = [];
  tbPais: Combobox[] = [];

  distritos: Distrito[] = [];
  filterDistritos: Observable<Distrito[]> | undefined;
  controlDistritos = new FormControl();

  selectedPais: Combobox = new Combobox();
  
  maxDate: Date = new Date();
  minDate: Date = new Date();

  ngOnInit(): void {
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
    }

    this.minDate.setMonth(this.maxDate.getMonth() - 12*80);
    this.listarCombo();    

    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '###', disabled: true}),
      'TipDocu': new FormControl({ value: '', disabled: false}),
      'NumDocu': new FormControl({ value: '', disabled: false}),
      'ApPaterno': new FormControl({ value: '', disabled: false}),
      'ApMaterno': new FormControl({ value: '', disabled: false}),
      'Nombres': new FormControl({ value: '', disabled: false}),
      'Sexo': new FormControl({ value: '', disabled: false}),
      'FecNacimiento': new FormControl({ value: null, disabled: false}),
      'CodPais': new FormControl({ value: '', disabled: false}),
      'CodDepartamento': new FormControl({ value: '', disabled: false}),
      'CodProvincia': new FormControl({ value: '', disabled: false}),
      'CodDistrito': new FormControl({ value: '', disabled: false}),
      'Celular': new FormControl({ value: '', disabled: false}),
      'Telefono': new FormControl({ value: '', disabled: false}),
      'Correo': new FormControl({ value: '', disabled: false})
    });

    /*this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.ver = (data["ver"]=='true')? true : false
      this.obtener();
    });*/
  }

  listarCombo(){
    this.comboboxService.cargarDatos(this.tablasMaestras,this.curUser).subscribe(data=>{
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        var tbCombobox: Combobox[] = data.items;

        this.tbTipoDocu = tbCombobox.filter(e => e.codTabla?.trim() === 'TDoc');
        this.tbPais = tbCombobox.filter(e => e.codTabla?.trim() === 'PAIS');
        var tbDpto: Combobox[] = tbCombobox.filter(e => e.codTabla?.trim() === 'DEPA');
        var tbProv: Combobox[] = tbCombobox.filter(e => e.codTabla?.trim() === 'PROV');
        var tbDist: Combobox[] = tbCombobox.filter(e => e.codTabla?.trim() === 'DST');

        this.listarDistritos(tbDpto, tbProv, tbDist);
      }
    });
  }

  listarDistritos(tbDpto: Combobox[], tbProv: Combobox[], tbDist: Combobox[]){
    tbDist.sort((a, b) => (a.codigo === undefined || b.codigo === undefined) ? 1 : (a.codigo < b.codigo ? -1 : (a.codigo > b.codigo ? 1 : 0)));
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

  changePais(value: Combobox){
    this.selectedPais = value;
  }

  buscarDistritos(name: string): Distrito[]{    
    var results: Distrito[] = [];
    if(name.length >= 3){
      const filtro = name.toLowerCase();
      results = this.distritos.filter(e => e.dist?.descripcion?.toLowerCase().includes(filtro));
    }    
    return results;
  }

  mostrarDistrito(d: Distrito): string{
    //debugger;
    var result = '';
    if(d !== undefined && d !== null)
      result = d.dist?.descripcion! + ', ' + d.prov?.descripcion! + ', ' + d.dpto?.descripcion!;
    return result;
  }

}
