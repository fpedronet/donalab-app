import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Html5Qrcode,Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

@Component({
  selector: 'app-mcodigobarra',
  templateUrl: './mcodigobarra.component.html',
  styleUrls: ['./mcodigobarra.component.css']
})
export class McodigobarraComponent implements OnInit {

  html5QrCodes! : any;
  private cameraId! : any;

  constructor(
    private dialogRef: MatDialogRef<McodigobarraComponent>
  ) { }

  ngOnInit(): void {

    Html5Qrcode.getCameras().then((devices:any[]) => {    
      
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
    let width = 300;

    const html5QrCode = new Html5Qrcode(
      'reader',
      {
        verbose: true,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.EAN_13
        ],
      }
    );
   
    this.html5QrCodes = html5QrCode;

    html5QrCode.start(
      this.cameraId, 
      { 
        fps: 1, 
        qrbox: {
          width: Math.round(width * 0.8),
          height: Math.round(250 * 0.5),
          },
      },   
      qrCodeMessage => {
        this.setearValores(qrCodeMessage);
        this.disableScanner()
      },
      errorMessage => {
          // parse error, ideally ignore it. For example:
          console.log(`QR Code no longer in front of camera.`);
      })
      .catch(err => {
          // Start failed, handle it. For example, 
          console.log(`Unable to start scanning, error: ${err}`);
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
