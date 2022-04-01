import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private usuarioService: UsuarioService
  ) { }

  idEncuesta?: string;
  usuario?: string;

  logo?: string =environment.UrlImage + "logo.png";
  slider1?: string =environment.UrlImage + "slider1.png";
  slider2?: string =environment.UrlImage + "slider2.png";
  slider3?: string =environment.UrlImage + "slider3.png";
  slider4?: string =environment.UrlImage + "slider4.png";

  ngOnInit(): void {
    this.usuario = this.usuarioService.sessionUsuario()?.nombre;
  }

}
