import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { ChequeofisicoService } from 'src/app/_service/chequeofisico.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { NotifierService } from 'src/app/page/component/notifier/notifier.service';

import { Combobox } from 'src/app/_model/combobox';
import { ChequeoFisico } from 'src/app/_model/chequeofisico';

@Component({
  selector: 'app-cchequeo',
  templateUrl: './cchequeo.component.html',
  styleUrls: ['./cchequeo.component.css']
})
export class CchequeoComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  listaTipoExtraccion?: Combobox[] = [];
  listaLesionesPuncion?: Combobox[] = [];
  listaGrupoSanguineo?: Combobox[] = [];
  listaAspectoGeneral?: Combobox[] = [];
  listaAspectoVenoso?: Combobox[] = [];
  listaMotivoRechazo?: Combobox[] = [];

  nombres: string = "";
  documento: string ="";
  CodEstado: string = "0";
  Codigo?: number;
  id: number = 0;
  ver: boolean = true;
  $disable: boolean =false;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spinner: SpinnerService,
    private notifierService : NotifierService,
    private usuarioService: UsuarioService,
    private chequeofisicoService: ChequeofisicoService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'idePreDonante': new FormControl({ value: 0, disabled: false}),
      'nIdTipoExtraccion': new FormControl({ value: '', disabled: false}),
      'codigo': new FormControl({ value: '', disabled: false}),
      'fecha': new FormControl({ value: new Date(), disabled: false}),
      'pesoDonacion': new FormControl({ value: '', disabled: false}),
      'tallaDonacion': new FormControl({ value: '', disabled: false}),
      'hemoglobina': new FormControl({ value: '', disabled: false}),
      'hematocrito': new FormControl({ value: '', disabled: false}),
      'plaquetas': new FormControl({ value: '', disabled: false}),
      'presionArterial1': new FormControl({ value: '', disabled: false}),
      'presionArterial2': new FormControl({ value: '', disabled: false}),
      'presionArterial': new FormControl({ value: '', disabled: false}),
      'frecuenciaCardiaca': new FormControl({ value: '', disabled: false}),
      'ideGrupo': new FormControl({ value: '', disabled: false}),
      'aspectoGeneral': new FormControl({ value: '', disabled: false}),
      'lesionesVenas': new FormControl({ value: '', disabled: false}),
      'estadoVenoso': new FormControl({ value: '', disabled: false}),
      'obsedrvaciones': new FormControl({ value: '', disabled: false}),
      'temperatura': new FormControl({ value: '', disabled: false}),
      'ideMotivoRec': new FormControl({ value: '', disabled: false})
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

    this.chequeofisicoService.obtener(ids,cod,codigobanco).subscribe(data=>{

      this.listaTipoExtraccion = data.listaTipoExtraccion;
      this.listaLesionesPuncion = data.listaLesionesPuncion;
      this.listaGrupoSanguineo = data.listaGrupoSanguineo;
      this.listaAspectoGeneral = data.listaAspectoGeneral;
      this.listaAspectoVenoso = data.listaAspectoVenoso;
      this.listaMotivoRechazo = data.listaMotivoRechazo;

      if(ids!=0 || cod!=0){

        let aterrial1='';
        let aterrial2='';
        if(data.presionArterial!=""){
          let aterrial= data.presionArterial?.split('/');
  
          if(aterrial!.length>1){
            aterrial1= aterrial![0];
            aterrial2= aterrial![1];
          }
        }

        this.form = new FormGroup({
          'idePreDonante': new FormControl({ value: data.idePreDonante, disabled: false}),
          'nIdTipoExtraccion': new FormControl({ value: '', disabled: this.ver}),
          'codigo': new FormControl({ value: data.codigo, disabled: this.$disable}),
          'fecha': new FormControl({ value: data.fecha, disabled: this.ver}),
          'pesoDonacion': new FormControl({ value: data.pesoDonacion, disabled: this.ver}),
          'tallaDonacion': new FormControl({ value: data.tallaDonacion, disabled: this.ver}),
          'hemoglobina': new FormControl({ value: data.hemoglobina, disabled: this.ver}),
          'hematocrito': new FormControl({ value: data.hematocrito, disabled: this.ver}),
          'plaquetas': new FormControl({ value: data.plaquetas, disabled: this.ver}),
          'presionArterial1': new FormControl({ value: aterrial1, disabled: this.ver}),
          'presionArterial2': new FormControl({ value: aterrial2, disabled: this.ver}),
          'presionArterial': new FormControl({ value: data.presionArterial, disabled: this.ver}),
          'frecuenciaCardiaca': new FormControl({ value: data.frecuenciaCardiaca, disabled: this.ver}),
          'ideGrupo': new FormControl({ value: data.ideGrupo, disabled: this.ver}),
          'aspectoGeneral': new FormControl({ value: data.aspectoGeneral, disabled: this.ver}),
          'lesionesVenas': new FormControl({ value: data.lesionesVenas, disabled: this.ver}),
          'estadoVenoso': new FormControl({ value: data.estadoVenoso, disabled: this.ver}),
          'obsedrvaciones': new FormControl({ value: data.obsedrvaciones, disabled: this.ver}),
          'temperatura': new FormControl({ value: data.temperatura, disabled: this.ver}),
          'ideMotivoRec': new FormControl({ value: data.ideMotivoRec?.toString(), disabled: this.ver}),
        });

        this.Codigo = data.codigo;
        this.CodEstado = data.codEstado?.toString()!;
        this.nombres = data.nombres!;
        this.documento = data.documento!;
      }

      this.spinner.hideLoading();
    });      
  }

  changeEstado(estado: string){
    this.CodEstado= estado;
  }

  guardar(){
    let motivo = this.form.value['ideMotivoRec'];

    if(this.CodEstado=="2" && motivo==""){
      this.notifierService.showNotification(environment.ALERT,'Mensaje','Seleccione el motivo del rechazo');
    }else{

    let model = new ChequeoFisico();

    model.idePreDonante= this.form.value['idePreDonante'];
    model.codigo= this.Codigo;
    model.fecha= this.form.value['fecha'];
    model.pesoDonacion= this.form.value['pesoDonacion'];
    model.tallaDonacion= this.form.value['tallaDonacion'];
    model.hemoglobina= this.form.value['hemoglobina'];
    model.hematocrito= this.form.value['hematocrito'];
    model.plaquetas= this.form.value['plaquetas'];
    model.presionArterial= this.form.value['presionArterial1'] + "/" + this.form.value['presionArterial2'];
    model.frecuenciaCardiaca= this.form.value['frecuenciaCardiaca'];
    model.ideGrupo= this.form.value['ideGrupo'];
    model.aspectoGeneral= this.form.value['aspectoGeneral'];
    model.lesionesVenas= this.form.value['lesionesVenas'];
    model.estadoVenoso= this.form.value['estadoVenoso'];
    model.obsedrvaciones= this.form.value['obsedrvaciones'];
    model.temperatura= this.form.value['temperatura'];
    model.codEstado=  this.CodEstado;
    model.ideMotivoRec= this.form.value['ideMotivoRec'];
    model.aceptaAlarma= "0";
    
    this.spinner.showLoading();
    this.chequeofisicoService.guardar(model).subscribe(data=>{

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
}
