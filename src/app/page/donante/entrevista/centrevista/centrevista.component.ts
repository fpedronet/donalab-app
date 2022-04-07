import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { EntrevistaService } from 'src/app/_service/entrevista.service';

import { Combobox } from 'src/app/_model/combobox';

@Component({
  selector: 'app-centrevista',
  templateUrl: './centrevista.component.html',
  styleUrls: ['./centrevista.component.css']
})
export class CentrevistaComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  CodEstado: number = 0;
  id: number = 0;
  ver: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private entrevistaService: EntrevistaService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: '', disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'fecha': new FormControl({ value: new Date(), disabled: false}),
      'observaciones': new FormControl({ value: '', disabled: false}),
      'codEstado': new FormControl({ value: '', disabled: false}),
      'ideMotivoRec': new FormControl({ value: '', disabled: false})
    });

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.ver = (data["ver"]=='true')? true : false
      this.obtener(0);
    });

  }

  obtener(codigo: any){
    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    let ids=0;
    let cod=0;

    if(codigo!=0){
      cod = (codigo.target.value==0)? this.id: codigo.target.value;
    }else{
      ids=  this.id;
    }

    this.entrevistaService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoVenoso = data.listaAspectoVenoso;

      if(ids!=0 || cod!=0){

        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'codigo': new FormControl({ value: data.codigo, disabled: false}),
          'fecha': new FormControl({ value: new Date(), disabled: false}),
          'observaciones': new FormControl({ value: data.observaciones, disabled: false}),
          'codEstado': new FormControl({ value: data.codEstado, disabled: false}),
          'ideMotivoRec': new FormControl({ value: data.ideMotivoRec, disabled: false})
        });

      }

      this.spinner.hideLoading();
    });      
  }

  guardar(){

  }

  changeEstado(val: number){

  }
}
