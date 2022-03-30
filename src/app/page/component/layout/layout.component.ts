import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SpinnerService } from '../spinner/spinner.service';
import { environment } from 'src/environments/environment';

import { ConfigPermisoService } from './../../../_service/configpermiso.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

import { MenuResponse } from 'src/app/_model/menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner : SpinnerService,
    private ConfigPermisoService : ConfigPermisoService,
    private usuarioService: UsuarioService,
  ) { }

  menus: MenuResponse = {};
  codigo?:string;
  panelOpenState = false;
  count=true;
  banco?: string = "";

  ngOnInit(): void {
    this.listar();   
  }

  listar(){
    this.spinner.showLoading();
    this.ConfigPermisoService.listar().subscribe(data=>{
      this.menus.listaMenu = data.listaMenu;
      this.menus.listaBanco = data.listaBanco;

      let bancoselect = this.usuarioService.sessionUsuario().codigobanco;

      if(bancoselect!=null){
        this.codigo = bancoselect;
        this.banco = data.listaBanco?.filter(x=>x.codigo==bancoselect)[0].descripcion
      }else{
        this.codigo = data.listaBanco![0].codigo;
        this.banco = data.listaBanco![0].descripcion;
      }

      this.count = (data.listaBanco?.length!>1)? true: false;     

      localStorage.setItem(environment.CODIGO_BANCO, this.codigo!);

      this.spinner.hideLoading();
    });  
  }

  selectbanco(idbanco: number){
    localStorage.setItem(environment.CODIGO_BANCO, idbanco.toString()!);

    // this.route.params.subscribe((data: Params)=>{
    //   debugger;
    //   let id = (data["id"]==undefined)? 0:data["id"];
    //   console.log(id);
    //   console.log(data["id"]);
    // }); 

  }

  closeLogin(){
    localStorage.clear();
    this.router.navigate(['']);
  }

}
