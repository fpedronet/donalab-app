import { Component, DebugElement, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncrDecrService } from 'src/app/_service/encr-decr.service';
import { EncuestaService } from 'src/app/_service/encuesta.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';
import { NotifierService } from '../component/notifier/notifier.service';
import { LvistaclienteComponent } from '../vistacliente/lvistacliente/lvistacliente.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private encuestaService : EncuestaService,
    private notifierService : NotifierService,
    private EncrDecr: EncrDecrService,
    private router: Router,
    private usuarioService : UsuarioService, 
  ) { }

  idEncuesta?: string;
  usuario?: string;
  imgeinicio?: string =environment.UrlImage + "home-img.png";

  ngOnInit(): void {

    this.usuario = this.usuarioService.sessionUsuario()?.usuario;

    this.obtieneEncuestasPendientes();
  }

  abrirListaEncuestaCliente() {

    this.obtieneEncuestasPendientes();
  }

  obtieneEncuestasPendientes() {
    this.encuestaService.existeEncuesta().subscribe(data=>{
  
      this.idEncuesta = this.usuarioService.sessionUsuario()?.idEncuesta;
      
      //Reconoce si es la primera vez que inicia sesión
      let firstLogin = localStorage.getItem('first-time-login');
  
      if(data.items.length > 0){
        if(data.items.length <= 1 && data.items.length >=1 && firstLogin == 'true'){
          //Ya pasó la primera vez que inicia sesión en el login
          localStorage.setItem('first-time-login', 'false');
  
          //El nombre de usuario y el id del cliente se obtendrán en el front
          let id = parseInt(this.idEncuesta!);
          let value =  1 + '-' + this.idEncuesta + '-' + 0 + '-' + ' '+ '-'+ ' ';
          let key = this.EncrDecr.set(value);
  
          let url = '/page/vistacliente/' + key;
          this.router.navigate([url]);
        }
        else{
          this.dialog.open(LvistaclienteComponent, {
            width: '850px'
          });
        }
  
      }
      else{
        this.notifierService.showNotification(2,'Mensaje','No hay encuestas programadas para esta fecha');
      }
    });
  }
}
