import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
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

  tablasMaestras = ['TDoc', 'PAIS', 'PROV', 'DEPA', 'DST'];
  tbTipoDocu: Combobox[] = [];
  tbPais: Combobox[] = [];
  tbProv: Combobox[] = [];
  tbDpto: Combobox[] = [];
  tbDist: Combobox[] = [];

  ngOnInit(): void {
    let user = this.usuarioService.sessionUsuario();
    if(user!=null){
      this.curUser = user.ideUsuario;
    }
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

        this.tbTipoDocu = tbCombobox.filter(e => e.codTabla === 'TDoc');
        this.tbPais = tbCombobox.filter(e => e.codTabla === 'PAIS');
        this.tbProv = tbCombobox.filter(e => e.codTabla === 'DEPA');
        this.tbDist = tbCombobox.filter(e => e.codTabla === 'DST');
      }
    });
  }

}
