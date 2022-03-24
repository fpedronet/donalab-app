import { Component, OnInit } from '@angular/core';
import { Combobox } from 'src/app/_model/combobox';
import { Persona } from 'src/app/_model/persona';
import { ComboboxService } from 'src/app/_service/combobox.service';

@Component({
  selector: 'app-lpostulante',
  templateUrl: './lpostulante.component.html',
  styleUrls: ['./lpostulante.component.css']
})
export class LpostulanteComponent implements OnInit {

  combo?: Combobox;

  dataSource: Persona[] = [];
  displayedColumns: string[] = ['NombreMostrar'];
  loading = false;
  existRegistro = false;
  countRegistro = 0;

  constructor(
    private comboboxService : ComboboxService,
  ) { }

  ngOnInit(): void {
    this.listarCombo();
  }

  listarCombo(){
    //this.loadingService.openLoading();
    
    this.comboboxService.cargarDatos().subscribe(data=>{
      if(data === undefined){
        //this.toastService.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        this.combo = data;
      }      
      //this.loadingService.closeLoading();

      //Precargar DNI
    });
  }

}
