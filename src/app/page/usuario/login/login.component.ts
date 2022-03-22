import { environment } from 'src/environments/environment';
import { Usuario } from './../../../_model/usuario';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/_model/cliente';

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
  cliente: Cliente[] = [];
  nIdCliente?: number;
  usuario?: string;
  clave?: string;
  mensaje?: string;
  error?: string;
  opcionSeleccionado?: number  = 0;
  hidep?: boolean = true;
  logologin?: string =environment.UrlImage + "logo.png";

  ngOnInit(): void {

    this.form = new FormGroup({
      'nIdCliente': new FormControl(),
      'usuario': new FormControl(''),
      'clave': new FormControl('')
    });


    this.listarCliente();
  }

  listarCliente(){
    this.spinner.showLoading();
      this.usuarioService.listarCliente().subscribe(data=>{
        this.cliente= data.items;
        this.spinner.hideLoading();
      });
  }

  login(){

    let model = new Usuario();

    model.nIdCliente= this.form.value['nIdCliente'];
    model.usuario = this.form.value['usuario'];
    model.cClave= this.form.value['clave'];

    if(model.nIdCliente==null || model.cClave=="" || model.usuario==""){
      if(model.nIdCliente==null || model.cClave==""){
        this.notifierService.showNotification(2,'Mensaje','Ingresa el cliente y la contraseña');
      }
      else{
        this.notifierService.showNotification(2,'Mensaje','Ingresa un nombre o acrónimo para identificarse en la encuesta');
      }
      this.spinner.hideLoading();

    }else{

      this.spinner.showLoading();
      this.usuarioService.login(model).subscribe(data=>{
  
        if(data.typeResponse==environment.EXITO){
          localStorage.setItem(environment.TOKEN_NAME, data.access_token!);
          localStorage.setItem('first-time-login', 'true');
  
          this.router.navigate(['/page/inicio']);
        }
              
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);
        this.spinner.hideLoading();
      }); 
    }
  }

  hide(){
    hidep:false;
  }

}
