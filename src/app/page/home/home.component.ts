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
  imgeinicio?: string =environment.UrlImage + "home-img.png";

  ngOnInit(): void {
    this.usuario = this.usuarioService.sessionUsuario()?.nombre;
  }

}
