import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/page/component/spinner/spinner.service';

@Component({
  selector: 'app-mfaspirantelingth',
  templateUrl: './mfaspirantelingth.component.html',
  styleUrls: ['./mfaspirantelingth.component.css']
})
export class MfaspirantelingthComponent implements OnInit {

  constructor(
    private spinner : SpinnerService,
    private dialogRef: MatDialogRef<MfaspirantelingthComponent>,
  ) { }

  loading = true;

  codigo?:string;
  idbanco?: number;

  fechaInicio?: Date;
  fechaSelectInicio?: Date;

  fechaFin?: Date;
  fechaSelectFin?: Date;

  ngOnInit(): void {
    obtener();
  }

  obtener(){

  }
  
  selectbanco(idbanco: number){
   
  }
  
  onDateChange(){
    let finicio = this.fechaSelectInicio;
    let ffin =  this.fechaSelectFin;
    
  }

}
