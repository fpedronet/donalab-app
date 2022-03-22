import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import lista from 'src/assets/json/listaopcione.json';
import { Menu } from '../_model/menu';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  menus: Menu = {};
  listamenu: Menu[] = [];

  getListarMenu(){  
    this.listamenu= [];

    for(var k in lista) {
      this.menus ={};

      this.menus.url =lista[k].url;
      this.menus.nombre =lista[k].nombre;
      this.menus.icon =lista[k].icon;
      this.menus.admin=lista[k].admin;
      this.listamenu.push(this.menus);
   }

   let token = localStorage.getItem(environment.TOKEN_NAME);
   let helper = new JwtHelperService();
   let decodedToken = helper.decodeToken(token!);

   let admin = (decodedToken.nEsAdministrador=="0")? false:true;

   this.listamenu = (admin==true)? this.listamenu: this.listamenu.filter(y=>y.admin==admin);

   return this.listamenu;
  }
}
