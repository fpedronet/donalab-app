import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { MenuService } from 'src/app/_service/menu.service';

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
    private menuService : MenuService,
  ) { }

  menus: MenuResponse = {};

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.spinner.showLoading();
    this.menuService.listar(1).subscribe(data=>{
      this.menus.listaMenu = data.listaMenu;
      this.spinner.hideLoading();
    });      
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
