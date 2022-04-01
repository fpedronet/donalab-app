import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

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

    this.predonanteService.obtenerFiltro(codigobanco).subscribe(resut=>{

      this.listaCampania = resut.listaCampania;
      this.listaOrigen = resut.listaOrigen;
      this.listaEstado = resut.listaEstado;

      this.nombre=this.data.nombre,
      this.idcampania=String(this.data.idcampania),
      this.idorigen=String(this.data.idorigen),
      this.idestado=String(this.data.idestado),
      this.fechaSelectInicio=this.data.fechaInicio,
      this.fechaSelectFin=this.data.fechaFin,
      this.fechaInicio=this.data.fechaInicio,
      this.fechaFin=this.data.fechaFin,

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

  buscar(){
    this.dialogRef.close({ 
      nombre:this.nombre,
      idcampania:this.idcampania ,
      idorigen:this.idorigen ,
      idestado:this.idestado ,
      fechaInicio:this.fechaInicio ,
      fechaFin:this.fechaFin ,
     });
  }

}
