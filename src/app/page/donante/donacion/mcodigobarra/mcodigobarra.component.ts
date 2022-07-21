import { Component, OnInit } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-mcodigobarra',
  templateUrl: './mcodigobarra.component.html',
  styleUrls: ['./mcodigobarra.component.css']
})
export class McodigobarraComponent implements OnInit {

  scannerEnabled: boolean = false;
  public qrcode:string = '';    
  public windowsWidth:string = `${window.innerWidth > 500 ? 500 : window.innerWidth}px`;

  html5QrCodes! : any;
  private cameraId! : any;
  public output!: string;

  constructor() { }

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
    this.scannerEnabled = true;

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
    debugger;

    console.log($event);
    this.closeModal($event);
  }

  closeModal($event : string){
    // this.dialogRef.close();
    this.disableScanner();
  }

  disableScanner() {
    this.scannerEnabled = false;

    if(this.html5QrCodes!=undefined){
      this.html5QrCodes.stop().then(() => {
      }).catch(() => {
      });
    }
  }

}
