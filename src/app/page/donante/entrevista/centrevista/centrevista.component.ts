import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { EntrevistaService } from 'src/app/_service/entrevista.service';

import { Combobox } from 'src/app/_model/combobox';
import { Pregunta } from 'src/app/_model/pregunta';
import { Entrevista } from 'src/app/_model/entrevista';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-centrevista',
  templateUrl: './centrevista.component.html',
  styleUrls: ['./centrevista.component.css']
})
export class CentrevistaComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  listaPregunta?: Pregunta[] = [];
  
  nombres: string = "";
  documento: string ="";
  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  ver: boolean = true;
  $disable: boolean =false;
  btnaceptado: boolean = false;
  btnrechazado: boolean = false;

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private entrevistaService: EntrevistaService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: '', disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'codEstado': new FormControl({ value: '', disabled: false}),
      'ideMotivoRec': new FormControl({ value: '', disabled: false}),
      'pesoDonacion': new FormControl({ value: '', disabled: true}),
      'hemoglobina': new FormControl({ value: '', disabled: true}),
      'nIdTipoProceso': new FormControl({ value: '', disabled: false}),
      'tallaDonacion': new FormControl({ value: '', disabled: true}),
      'hematocrito': new FormControl({ value: '', disabled: true}),
      'nIdTipoExtraccion': new FormControl({ value: '', disabled: false}),
      'ideGrupo': new FormControl({ value: '', disabled: false}),
      'estadoVenoso': new FormControl({ value: '', disabled: false}),
      'lesionesVenas': new FormControl({ value: '', disabled: false}),
      'fechaMed': new FormControl({ value: new Date(), disabled: false}),
      'observacionesMed': new FormControl({ value: '', disabled: false}),
    });

    this.route.params.subscribe((data: Params)=>{
      this.id = (data["id"]==undefined)? 0:data["id"];
      this.ver = (data["ver"]=='true')? true : false
      this.obtener(0);
    });

  }

  obtener(codigo: any){
    this.spinner.showLoading();
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;
    let ids=0;
    let cod=0;
    this.nombres = "";
    this.documento = "";

    if(codigo!=0){
      cod = (codigo.target.value==0)? this.id: codigo.target.value;
      this.$disable = false;
    }else{
      ids=  this.id;
      this.$disable = true;
    }

    this.entrevistaService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoVenoso = data.listaAspectoVenoso;
      this.listaPregunta = data.listaPregunta;

      if(ids!=0 || cod!=0){

        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'codigo': new FormControl({ value: data.codigo, disabled: this.ver}),
          'codEstado': new FormControl({ value: data.codEstado, disabled: this.ver}),
          'ideMotivoRec': new FormControl({ value: data.ideMotivoRec, disabled: this.ver}),
          'pesoDonacion': new FormControl({ value: data.pesoDonacion, disabled: true}),
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: true}),
          'nIdTipoProceso': new FormControl({ value: data.nIdTipoProceso, disabled: this.ver}),
          'tallaDonacion': new FormControl({ value: data.tallaDonacion, disabled: true}),
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: true}),
          'nIdTipoExtraccion': new FormControl({ value: data.nIdTipoExtraccion, disabled: this.ver}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: this.ver}),
          'estadoVenoso': new FormControl({ value: data.estadoVenoso, disabled: this.ver}),
          'lesionesVenas': new FormControl({ value: data.lesionesVenas, disabled: this.ver}),
          'fechaMed': new FormControl({ value: new Date(), disabled: this.ver}),
          'ObservacionesMed': new FormControl({ value: data.observacionesMed, disabled: this.ver}),
        });

        this.Codigo = data.codigo;
        this.CodEstado = data.codEstado?.toString()!;
        this.nombres = data.nombres!;
        this.documento = data.documento!;
      }

      this.spinner.hideLoading();
    });      
  }

  changeEstado(estado: string, btn: string){
    this.CodEstado= estado;

    if(btn=="btn1"){
      this.btnaceptado= true;
      this.btnrechazado= false;
    }else if(btn=="btn2"){
      this.btnaceptado= false;
      this.btnrechazado= true;
    }
  }

  changeEstadoPregunta(estado: string, btn: string, idePregunta?: number){
debugger;
    var result = this.listaPregunta?.filter(y=>y.idePregunta==idePregunta)[0];
    result!.respuesta= estado;
    
    // if(btn=="btn1"){
    //   this.btnsi= true;
    //   this.btnno= false;
    // }else if(btn=="btn2"){
    //   this.btnsi= false;
    //   this.btnno= true;
    // }

  }

  guardar(){
    let model = new Entrevista();

    model.idePreDonante= this.form.value['idePreDonante'];
    model.codigo= this.Codigo;
    model.fechaMed= this.form.value['fechaMed'];
    model.observacionesMed= this.form.value['observacionesMed'];
    model.codEstado= this.form.value['codEstado'];
    model.ideMotivoRec= this.form.value['ideMotivoRec'];

    this.spinner.showLoading();
    this.entrevistaService.guardar(model).subscribe(data=>{

      this.notifierService.showNotification(data.typeResponse!,'Mensaje',data.message!);

        if(data.typeResponse==environment.EXITO){
          this.router.navigate(['/page/donante/aspirante']);
          this.spinner.hideLoading();
        }else{
          this.spinner.hideLoading();
        }
      });
  }

}
