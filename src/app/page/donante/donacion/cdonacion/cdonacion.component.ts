import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import forms from 'src/assets/json/formulario.json';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';

import { Combobox } from 'src/app/_model/combobox';
import { environment } from 'src/environments/environment';
import { Permiso } from 'src/app/_model/permiso';

@Component({
  selector: 'app-cdonacion',
  templateUrl: './cdonacion.component.html',
  styleUrls: ['./cdonacion.component.css']
})
export class CdonacionComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  permiso: Permiso = {};

  nombres: string = "";
  documento: string ="";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  ngOnInit(): void {

    this.inicializar();

    this.obtenerpermiso();
  }

  inicializar(){
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: '', disabled: false}),
    });

  }

  obtener(){

  }

  obtenerpermiso(){
    this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
    });   
  }

  guardar(){

  }

}
  

