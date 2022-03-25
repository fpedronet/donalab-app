import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsuarioService } from 'src/app/_service/usuario.service';
import { NotifierService } from '../../component/notifier/notifier.service';
import { SpinnerService } from '../../component/spinner/spinner.service';

import { CadenaConexionDto, Usuario } from './../../../_model/usuario';

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
  logologin?: string =environment.UrlImage + "logo.png";
  hospital?: CadenaConexionDto[] = [];
  idHospital?: any;
  verHospital: boolean = false;

  ngOnInit(): void {

    this.listaHospital();

    this.form = new FormGroup({
      'usuario': new FormControl(''),
      'clave': new FormControl(''),
      'idHospital': new FormControl('')
    });
  }

  listaHospital(){

    let model = new Usuario();
    this.spinner.showLoading();
      this.usuarioService.listaHospital(model).subscribe(data=>{
        this.hospital = data.items;
        this.idHospital = this.hospital[0].idHospital;
        this.verHospital = (data.items.length>1)? true: false;
        this.spinner.hideLoading();
      }); 
  }
  
  login(){
    let model = new Usuario();

    model.usuario = this.form.value['usuario'];
    model.contrasenia= this.form.value['clave'];
    model.idHospital= (this.verHospital == false)? this.idHospital:   this.form.value['idHospital'];

    if(model.usuario==null || model.contrasenia=="" || model.idHospital==""){
      if(model.usuario==null || model.usuario==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingresa el usuario');
      }
      else if(model.contrasenia==null || model.contrasenia==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Ingresa la contraseña');
      }
      else if(model.contrasenia==null || model.contrasenia==""){
        this.notifierService.showNotification(environment.ALERT,'Mensaje','Seleccione el Hospital');
      }
      this.spinner.hideLoading();

    }else{

      this.spinner.showLoading();
      this.usuarioService.login(model).subscribe(data=>{
        
        if(data.typeResponse==environment.EXITO){
          localStorage.setItem(environment.TOKEN_NAME, data.access_token!);
  
          this.router.navigate(['/page/home']);
        }
              
        this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.mensaje!);
        this.spinner.hideLoading();
      }); 
    }
  }

}
