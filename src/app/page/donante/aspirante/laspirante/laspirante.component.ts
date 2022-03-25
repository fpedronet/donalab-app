import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ConfigPermisoService } from 'src/app/_service/configpermiso.service';
import forms from 'src/assets/json/formulario.json';

import { Permiso } from 'src/app/_model/permiso';

@Component({
  selector: 'app-laspirante',
  templateUrl: './laspirante.component.html',
  styleUrls: ['./laspirante.component.css']
})
export class LaspiranteComponent implements OnInit {

  constructor(
    private spinner : SpinnerService,
    private configPermisoService : ConfigPermisoService,
  ) { }

  permiso: Permiso = {};

  ngOnInit(): void {
    this.obtenerpermiso();
  }

  obtenerpermiso(){
    this.spinner.showLoading();
    this.configPermisoService.obtenerpermiso(forms.entrevista.codigo).subscribe(data=>{
      this.permiso = data;
       this.spinner.hideLoading();
    });   
  }

  obtenerbanco(){
    
  }

}
