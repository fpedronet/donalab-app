import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
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

  listaId?: string;
  isChecked! : boolean;

  ngOnInit(): void { 
    this.form = new FormGroup({
      'nIdEncuesta': new FormControl({ value: 0 }),
      'nCodigo': new FormControl({ value: '###', disabled: true }),
      'nIdSistemas': new FormControl({ value: '', disabled: false}),
      'nIdCliente': new FormControl({ value: '', disabled: false}),
      'cTitulo': new FormControl({ value: '', disabled: false}),
      'cDescripcion': new FormControl({ value: '', disabled: false}),
      'dFechaIni': new FormControl({ value: null, disabled: false}),
      'dFechaFin': new FormControl({ value: null, disabled: false})
    });

    /*this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.ver = (data["ver"]=='true')? true : false
      this.obtener();
    });*/
  }

}
