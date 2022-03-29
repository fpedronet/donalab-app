import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { environment } from 'src/environments/environment';

import { ConfigPermisoService } from './../../../_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

import { MenuResponse } from 'src/app/_model/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private spinner : SpinnerService,
    private ConfigPermisoService : ConfigPermisoService,
    private usuarioService: UsuarioService,
  ) { }

  menus: MenuResponse = {};
  codigo?:string;
  panelOpenState = false;
  count=true;
  banco?: string = "";
  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.spinner.showLoading();
    this.ConfigPermisoService.listar().subscribe(data=>{
      this.menus.listaMenu = data.listaMenu;
      this.menus.listaBanco = data.listaBanco;
      this.codigo = data.listaBanco![0].codigo;
      this.count = (data.listaBanco?.length!>1)? true: false;
      this.banco = data.listaBanco![0].descripcion;

      localStorage.setItem(environment.CODIGO_BANCO, this.codigo!);

      this.spinner.hideLoading();
    });  
  }

  selectbanco(idbanco: number){
    localStorage.setItem(environment.CODIGO_BANCO, idbanco.toString()!);
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
