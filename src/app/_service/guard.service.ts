import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Menu } from '../_model/menu';
import { MenuService } from './menu.service';

import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(

    private usuarioService: UsuarioService,
    private router: Router,
    private menuService : MenuService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //1) VERIFICAR SI ESTA LOGUEADO
    let token = localStorage.getItem(environment.TOKEN_NAME);
    let url = state.url;

    if (!token) {
      if(url=="/login" || url==""){
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
    }

    //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
    let helper = new JwtHelperService();
    if (!helper.isTokenExpired(token!)) {
      //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESA PAGINA  
      //url -> /pages/consulta

      if(url=="/login"){
         this.router.navigate(['/page/inicio']);
         return false;
      }

      let lista = this.menuService.getListarMenu();
      let cont = 0;

      for (let m of lista) {
          if (url.startsWith(m.url!)) {
            cont++;
            break;
          }
      }

      if (cont > 0) {
          return true;
      } else {
         this.router.navigate(['/page/not-403']);
          return false;
      }

    } else {
      this.usuarioService.closeLogin();
      return false;
    }
  } 
}
