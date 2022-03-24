import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { ConfigPermisoService } from './../../../_service/configpermiso.service';

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
  ) { }

  menus: MenuResponse = {};

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.spinner.showLoading();
    this.ConfigPermisoService.listar(1).subscribe(data=>{
      this.menus.listaMenu = data.listaMenu;
      this.spinner.hideLoading();
    });      
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
