import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private menuService : MenuService,
  ) { }

  menus: Menu[] = [];

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.menus = this.menuService.getListarMenu();
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
