import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Combobox } from 'src/app/_model/combobox';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ChequeofisicoService } from 'src/app/_service/chequeofisico.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-cchequeo',
  templateUrl: './cchequeo.component.html',
  styleUrls: ['./cchequeo.component.css']
})
export class CchequeoComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  listaTipoExtraccion?: Combobox[] = [];
  listaAspectoGeneral?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];

  constructor(
    private spinner: SpinnerService,
    private usuarioService: UsuarioService,
    private chequeofisicoService: ChequeofisicoService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'Codigo': new FormControl({ value: '#######', disabled: true}),
      'otro': new FormControl({ value: 0, disabled: false}),
      'nIdTipoExtraccion': new FormControl({ value: '', disabled: false}),
      
    });

    this.obtener();
  }

  obtener(){

    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    this.chequeofisicoService.obtener(0,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaAspectoGeneral = data.listaAspectoGeneral;
      this.listaAspectoVenoso = data.listaAspectoVenoso;

      this.spinner.hideLoading();
    });      
  }

  guardar(){

  }
}
