import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { ConfigPermisoService } from './../../../_service/configpermiso.service';

import { MenuResponse } from 'src/app/_model/menu';
import { UsuarioService } from 'src/app/_service/usuario.service';

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

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.spinner.showLoading();
    this.ConfigPermisoService.listar().subscribe(data=>{
      this.menus.listaMenu = data.listaMenu;
      this.spinner.hideLoading();
    });  
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
