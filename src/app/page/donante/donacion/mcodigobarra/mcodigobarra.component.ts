import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import Quagga from 'quagga';

@Component({
  selector: 'app-mcodigobarra',
  templateUrl: './mcodigobarra.component.html',
  styleUrls: ['./mcodigobarra.component.css']
})
export class McodigobarraComponent implements OnInit {

  barcode = '';
  barcodeResult: any;

  configQuagga = {
    inputStream: {
      name: 'Live',
      type: 'LiveStream',
      target: '#inputBarcode',
      constraints: {
        width: { min: 450 },
        height: { min: 320 },
        aspectRatio: { min: 1, max: 2 }, // sane aspect ratios?
        facingMode: 'environment', // or user
      },
      singleChannel: false // true: only the red color-channel is read
    },
    locator: {
      patchSize: 'medium',
      halfSample: true
    },
    locate: true,
    numOfWorkers: 4,
    decoder: {
      readers: ['code_128_reader', "code_39_reader","ean_reader",]
    }
  };

  constructor(
    private dialogRef: MatDialogRef<McodigobarraComponent>
  ) { }

  ngOnInit(): void {
    this.startScanner();
  }

  startScanner() {
    this.barcode = '';

    Quagga.onProcessed((result: any) => this.onProcessed(result));

    Quagga.onDetected((result: any) => this.logCode(result));

    Quagga.init(this.configQuagga, (err: any) => {
      if (err) {
        return console.log(err);
      }
      Quagga.start();
    });
  }

  private onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {

      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width'), 20), parseInt(drawingCanvas.getAttribute('height'), 20));
        result.boxes.filter(function (box: any) {
          return box !== result.box;
        }).forEach(function (box: any) {
          Quagga.ImageDebug.drawPath(box,{
             x: 0, y: 1 
            },
            drawingCtx, { 
              color: 'green', 
              lineWidth: 2 
          });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { 
          x: 0, 
          y: 1 
        }, 
        drawingCtx, { 
          color: '#00F', 
          lineWidth: 2 
        });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, { 
          x: 'x',
          y: 'y' 
        }, 
        drawingCtx, { 
          color: 'red', 
          lineWidth: 3 
        });
      }
    }
  }

  private logCode(result : any) {
    const code = result.codeResult.code;
   
    if (this.barcode !== code) {
        this.closeModal(code);
    }

  }


  closeModal($event : any){
    Quagga.stop();

    if($event!="" && $event!=null && $event!=undefined){
      this.dialogRef.close({data: $event});
    }else{
      this.dialogRef.close();
    }
  }

}
