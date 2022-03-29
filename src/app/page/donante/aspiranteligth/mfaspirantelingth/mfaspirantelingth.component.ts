import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';
import { Combobox } from 'src/app/_model/combobox';
import { PredonanteService } from 'src/app/_service/predonante.service';

@Component({
  selector: 'app-mfaspirantelingth',
  templateUrl: './mfaspirantelingth.component.html',
  styleUrls: ['./mfaspirantelingth.component.css']
})
export class MfaspirantelingthComponent implements OnInit {

  constructor(
    private spinner : SpinnerService,
    private predonanteService : PredonanteService,
    private dialogRef: MatDialogRef<MfaspirantelingthComponent>,
  ) { }

  loading = true;

  listaBanco?: Combobox[] = [];
  codigo?:string;
  idbanco?: number;

  listaOrigen?: Combobox[] = [];

  listaEstado?: Combobox[] = [];

  fechaInicio?: Date;
  fechaSelectInicio?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  ngOnInit(): void {
    this.obtener();
  }

  obtener(){
    this.spinner.showLoading();
    this.predonanteService.obtenerFiltro().subscribe(data=>{
      this.listaBanco = data.listaBanco;
      this.listaOrigen = data.listaOrigen;
      this.listaEstado = data.listaEstado;
      this.spinner.hideLoading();
    });  
  }

  selectbanco(idbanco: number){
   
  }
  
  onDateChange(){
    let finicio = this.fechaSelectInicio;
    let ffin =  this.fechaSelectFin;
    
  }

}
