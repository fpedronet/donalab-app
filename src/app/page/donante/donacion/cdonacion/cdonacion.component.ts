import { Component, OnInit } from '@angular/core';
import { Foto } from 'src/app/_model/foto';
import { Predonante } from 'src/app/_model/predonante';
import { PredonanteService } from 'src/app/_service/predonante.service';

@Component({
  selector: 'app-cdonacion',
  templateUrl: './cdonacion.component.html',
  styleUrls: ['./cdonacion.component.css']
})
export class CdonacionComponent implements OnInit {


  imageUrl!: string;
  imageError!: string;
  isImageSaved!: boolean;

  constructor(
    private predonanteService: PredonanteService
    
  ) { }

  ngOnInit(): void {
  }

  upload(fileInput: any) {

    this.imageError = "";
    if (fileInput.target.files && fileInput.target.files[0]) {

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {

                const imgBase64Path = e.target.result;
                this.imageUrl = imgBase64Path;
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);

    }
  }

  guardar(){

    let model = new Predonante();
    model.strFoto = this.imageUrl!;
  
    this.predonanteService.postFile(model).subscribe(data=>{
      //debugger;
      console.log(data);      
    });
  }

  obtener(){

    this.predonanteService.obtenerFoto().subscribe(data=>{
      
      this.imageUrl = data.foto?.foto!;
      console.log(data);      
    });
  }

}
  

