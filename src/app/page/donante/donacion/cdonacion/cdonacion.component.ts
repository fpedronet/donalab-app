import { Component, OnInit } from '@angular/core';
import { PredonanteService } from 'src/app/_service/predonante.service';

@Component({
  selector: 'app-cdonacion',
  templateUrl: './cdonacion.component.html',
  styleUrls: ['./cdonacion.component.css']
})
export class CdonacionComponent implements OnInit {

  imageUrl: string = "../../../../../assets/people.png";
  fileToUpload!: File;

  constructor(
    private predonanteService: PredonanteService
    
  ) { }

  ngOnInit(): void {
  }


  handleFileInput(file: any) {
    debugger;
    this.fileToUpload =file.target.files.item(0)!;

    //Show image preview
    var reader = new FileReader();
    reader.onload = (event:any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  btnguardar(){
    debugger;
    let file = this.fileToUpload;

   this.predonanteService.postFile("",file).subscribe(
     data =>{
       console.log('done');
      //  Caption.value = null;
      //  Image.value = null;
       this.imageUrl = "../../../../../assets/people.png";
     }
   );
  }
}
  

