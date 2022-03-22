import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { dataCollection } from '../_model/dataCollection';

import { TokenUsuario, Usuario } from '../_model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url: string = `${environment.UrlApi}/usuario`;
  
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  listarCliente(){
    let urls = `${this.url}/GetAllClienteActivo`;

    return this.http.get<dataCollection>(urls)
  }

  login(usuario: Usuario){
    let urls = `${this.url}/PostLogin`;

    return this.http.post<TokenUsuario>(urls, usuario);
  }

  login2(usuario: Usuario) {
    let urls = `${this.url}/PostLogin`;
    const body = `grant_type=password&nIdCliente=${encodeURIComponent(usuario.nIdCliente!)}&cClave=${encodeURIComponent(usuario.cClave!)}&Usuario=${encodeURIComponent(usuario.usuario!)}`;

    return this.http.post<any>(urls, body, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8').set('Authorization', 'Basic ' + btoa(environment.TOKEN_AUTH_USERNAME + ':' + environment.TOKEN_AUTH_PASSWORD))
    });
  }

  isLogin() {
    let token = localStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  sessionUsuario(){
    let helper = new JwtHelperService();
    let token = localStorage.getItem(environment.TOKEN_NAME);

    if (!helper.isTokenExpired(token!)){

      let decodedToken = helper.decodeToken(token!);      
      return decodedToken;
    }else{
      return null;
    }
  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
