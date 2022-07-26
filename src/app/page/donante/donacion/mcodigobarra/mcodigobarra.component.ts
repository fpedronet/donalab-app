import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-mcodigobarra',
  templateUrl: './mcodigobarra.component.html',
  styleUrls: ['./mcodigobarra.component.css']
})
export class McodigobarraComponent implements OnInit {

  scannerEnabled: boolean = false;
  public qrcode:string = '';    
  public windowsWidth:string = `${window.innerWidth > 600 ? 600 : window.innerWidth}px`;

  html5QrCodes! : any;
  private cameraId! : any;
  public output!: string;

  constructor(
    private dialogRef: MatDialogRef<McodigobarraComponent>
  ) { }

  ngOnInit(): void {
    this.getCameras();
  }

  getCameras() {
    // alert("paso alert 1");
    Html5Qrcode.getCameras().then((devices:any[]) => {    
      
      // alert(devices.length);
      if (devices && devices.length) {
       
        if(devices.length>=3){
          this.cameraId = devices[2].id;
        }
        else if(devices.length==2){
          this.cameraId = devices[1].id;
        }
        else if(devices.length==1){
          this.cameraId = devices[0].id;
        }
        this.enableScanner();
      }
    })
  }

  enableScanner() {   
    const html5QrCode = new Html5Qrcode("reader", true);

    this.html5QrCodes = html5QrCode;

    html5QrCode.start(
      this.cameraId, 
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 } 
      },   
      (decodedText, decodedResult) => {
        this.setearValores(decodedText);
        this.disableScanner()
      },
      (errorMessage) => {
      })
    .catch((err) => {
    });
  }

  setearValores($event : string){
    this.closeModal($event);
  }

  closeModal($event : string){
    if($event!="" && $event!=null && $event!=undefined){
      this.dialogRef.close({data: $event});
    }else{
      this.dialogRef.close();
    }

    this.disableScanner();
  }

  disableScanner() {
    if(this.html5QrCodes!=undefined){
      this.html5QrCodes.stop().then(() => {
      }).catch(() => {
      });
    }
  }

}
