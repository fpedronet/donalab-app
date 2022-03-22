import { Component, DebugElement, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncrDecrService } from 'src/app/_service/encr-decr.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';
import { NotifierService } from '../component/notifier/notifier.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private notifierService : NotifierService,
    private EncrDecr: EncrDecrService,
    private router: Router,
    private usuarioService : UsuarioService, 
  ) { }

  idEncuesta?: string;
  usuario?: string;
  imgeinicio?: string =environment.UrlImage + "home-img.png";

  ngOnInit(): void {

    // this.usuario = this.usuarioService.sessionUsuario()?.usuario;
    this.usuario="Admin";
  }

}
