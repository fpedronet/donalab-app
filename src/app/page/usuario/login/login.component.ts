import { environment } from 'src/environments/environment';
import { Usuario } from './../../../_model/usuario';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from 'src/app/_service/usuario.service';
import { NotifierService } from '../../component/notifier/notifier.service';
import { SpinnerService } from '../../component/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private notifierService : NotifierService,
    private spinner : SpinnerService,
    private usuarioService : UsuarioService,  
  ) { }


  form: FormGroup = new FormGroup({});
  usuario?: string;
  clave?: string;
  mensaje?: string;
  error?: string;
  opcionSeleccionado?: number  = 0;
  hidep?: boolean = true;
  logologin?: string =environment.UrlImage + "logo.png";

  ngOnInit(): void {

    this.form = new FormGroup({
      'usuario': new FormControl(''),
      'clave': new FormControl('')
    });
  }

  login(){
    this.router.navigate(['/page/inicio']);
  }

  hide(){
    hidep:false;
  }

}
