import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mfaspirante',
  templateUrl: './mfaspirante.component.html',
  styleUrls: ['./mfaspirante.component.css']
})
export class MfaspiranteComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<MfaspiranteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner : SpinnerService,
    private predonanteService : PredonanteService,
    private usuarioService: UsuarioService,

  ) { }

  loading = true;

  nombre? : string;

  listaCampania?: Combobox[] = [];
  idcampania?: string;

  listaOrigen?: Combobox[] = [];
  idorigen?: string;

  listaEstado?: Combobox[] = [];
  idestado?: string;

  fechaInicio?: Date;
  fechaSelectInicio?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  ngOnInit(): void {
    this.obtener();
  }

  obtener(){    
    let codigobanco = this.usuarioService.sessionUsuario().codigobanco;

    this.spinner.showLoading();
    this.predonanteService.obtenerFiltro(codigobanco).subscribe(resut=>{

      this.listaCampania = resut.listaCampania;
      this.listaOrigen = resut.listaOrigen;
      this.listaEstado = resut.listaEstado;

      let filtro = this.usuarioService.sessionFiltro();

      this.nombre= filtro![0];
      this.idcampania=filtro![1];
      this.idorigen=filtro![2];
      this.idestado=filtro![3];

      this.fechaSelectInicio=new Date(filtro![4]);
      this.fechaInicio=new Date(filtro![4]);

      this.fechaSelectFin=new Date(filtro![5]);
      this.fechaFin=new Date(filtro![5]);

      this.spinner.hideLoading();
    });  
  }

  selectcampania(id: string){
    this.idcampania= id;
   }

  selectorigen(id: string){
    this.idorigen= id;
  }

  selectestado(id: string){
    this.idestado= id;
  }
  
  onDateChange(){
    this.fechaInicio = this.fechaSelectInicio;
    this.fechaFin=  this.fechaSelectFin;    
  }

  limpiar(){
    this.nombre="";
    this.idcampania = "0";
    this.idorigen = "0";
    this.idestado! = "1";
    this.fechaInicio = new Date();
    this.fechaSelectInicio = new Date();
    this.fechaFin = new Date();
    this.fechaSelectFin = new Date();

    localStorage.setItem(environment.CODIGO_FILTRO, this.nombre +"|"+ this.idcampania+"|"+this.idorigen+"|"+this.idestado+"|"+this.fechaInicio+"|"+this.fechaFin);
  }

  buscar(){
    this.dialogRef.close();

    localStorage.setItem(environment.CODIGO_FILTRO, this.nombre +"|"+ this.idcampania+"|"+this.idorigen+"|"+this.idestado+"|"+this.fechaInicio+"|"+this.fechaFin);
  }


}
