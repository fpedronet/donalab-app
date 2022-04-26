import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/_service/configuracion/usuario.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GraficoService } from 'src/app/_service/grafico.service';
import { Serie, TipoStock } from 'src/app/_model/grafico';
import { NotifierService } from '../component/notifier/notifier.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { SpinnerService } from '../component/spinner/spinner.service';

export type ChartOptions = {
  series: any;
  labels: any;
  chart: any;
  responsive: any;
  dataLabels: any;
  plotOptions: any;
  yaxis: any;
  xaxis: any;
  fill: any;
  tooltip: any;
  stroke: any;
  legend: any;
};

@Component({
  selector: 'app-inicio',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  public reportegrafico1!: Partial<ChartOptions>;
  public reportegrafico2!: Partial<ChartOptions>;
  public reportegrafico3!: Partial<ChartOptions>;
  public reportegrafico4!: Partial<ChartOptions>;


  constructor(
    private usuarioService: UsuarioService,
    private spinner: SpinnerService,
    private graficoService : GraficoService,
    private notifier: NotifierService,
  ) { }

  arrayListSerie: Serie[] = [];
  arrayEtiqueta: Serie = {};

  arrayLabel1: string[] = [];
  arraySeries1?: number[] = [];

  arrayLabel2: string[] = [];
  arraySeries2?: number[] = [];

  arrayLabel3: string[] = [];
  arraySeries3?: number[] = [];

  arrayLabel4: string[] = [];
  arraySeries4?: number[] = [];

  arrayLabel5: string[] = [];
  arraySeries5?: number[][] = [];

  tipoReporte?: number = 0;
  registro1?: boolean = false;
  registro2?: boolean = false;
  registro3?: boolean = false;
  registro4?: boolean = false;
  registro5?: boolean = false;
  usuario?: string;

  $fechaInicio?: Date;
  $fechaFin?: Date;

  fechaInicio1?: Date;
  fechaSelectInicio1?: Date;
  fechaFin1?: Date;
  fechaSelectFin1?: Date;

  fechaInicio2?: Date;
  fechaSelectInicio2?: Date;
  fechaFin2?: Date;
  fechaSelectFin2?: Date;

  fechaInicio3?: Date;
  fechaSelectInicio3?: Date;
  fechaFin3?: Date;
  fechaSelectFin3?: Date;

  fechaInicio4?: Date;
  fechaSelectInicio4?: Date;
  fechaFin4?: Date;
  fechaSelectFin4?: Date;

  fechaInicio5?: Date;
  fechaSelectInicio5?: Date;
  fechaFin5?: Date;
  fechaSelectFin5?: Date;

  tiposSangre?: string[];
  cboTipoStock?: TipoStock[] = [];
  curTipoStock?: number;

  ngOnInit(): void {
//($fecha.getDate()-1)

    this.chart1();
    this.chart2();
    this.chart3();
    this.chart4();

    let $fecha = new Date();

    this.$fechaInicio = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    this.$fechaFin = new Date();

    this.fechaInicio1 = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    this.fechaSelectInicio1 = this.fechaInicio1;
    this.fechaFin1 = new Date();
    this.fechaSelectFin1 = new Date();

    this.fechaInicio2 = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    this.fechaSelectInicio2 = this.fechaInicio2;
    this.fechaFin2 = new Date();
    this.fechaSelectFin2 = new Date();

    this.fechaInicio3 = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    this.fechaSelectInicio3 = this.fechaInicio3;
    this.fechaFin3 = new Date();
    this.fechaSelectFin3 = new Date();

    this.fechaInicio4 = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    this.fechaSelectInicio4 = this.fechaInicio4;
    this.fechaFin4 = new Date();
    this.fechaSelectFin4 = new Date();

    this.fechaInicio5 = new Date($fecha.getFullYear(),$fecha.getMonth(), 1 );
    this.fechaSelectInicio5 = this.fechaInicio5;
    this.fechaFin5 = new Date();
    this.fechaSelectFin5 = new Date();

    //Añade tipos de gráficos
    this.cboTipoStock?.push(new TipoStock(5,'Stock Disponible',''));
    this.cboTipoStock?.push(new TipoStock(6,'Stock por Habilitar',''));
    this.cboTipoStock?.push(new TipoStock(7,'Stock Reservado',''));
    this.cboTipoStock?.push(new TipoStock(8,'Stock en Cuarentena',''));
    this.cboTipoStock?.push(new TipoStock(9,'Stock Vencido',''));

    this.curTipoStock = 5;

    this.listargrafico();
  }

  listargrafico(){

    let session = this.usuarioService.sessionUsuario();

    this.usuario = session.nombre;

    this.spinner.showLoading();

    this.graficoService.listar(session.codigobanco,this.$fechaInicio!,this.$fechaFin!,this.tipoReporte==5?this.curTipoStock:this.tipoReporte).subscribe(data =>{
      //debugger;
      let count1 = 0;
      let count2 = 0;
      let count3 = 0;
      let count4 = 0;
      let count5 = 0;
      let arraypendiente: number[] =  [];
      let arraydono: number[] =[];
      let arraynodono: number[] =[];
 
      let $grafico1 = data.filter(y=>y.ideGrafico==1);
      let $grafico2 = data.filter(y=>y.ideGrafico==2);
      let $grafico3 = data.filter(y=>y.ideGrafico==3);
      let $grafico4 = data.filter(y=>y.ideGrafico==4);
      let $grafico5 = data.filter(y=>y.ideGrafico==this.curTipoStock);

      if(this.tipoReporte==0){

        this.arrayLabel1 = [];
        this.arraySeries1 = [];
  
        this.arrayLabel2 = [];
        this.arraySeries2 = [];

        this.arrayLabel3 = [];
        this.arraySeries3 = [];
        this.arrayListSerie = [] = [];
        this.arrayEtiqueta = {} = {};

        this.arrayLabel4 = [];
        this.arraySeries4 = [];

        this.arrayLabel5 = [];
        this.arraySeries5 = [];

        this.tiposSangre = [];

        /* GRAFICO 1 */
        $grafico1.forEach(x=>{

          this.arrayLabel1.push(x.etiqueta!);
          let split = x.cantidades?.split('|');

          split!.forEach(y=>{
            count1 = parseInt(y) + count1;
            this.arraySeries1?.push(parseInt(y))
          });

        });

         /* GRAFICO 2 */
        $grafico2.forEach(x=>{

            this.arrayLabel2.push(x.etiqueta!);
            let split = x.cantidades?.split('|');

            split!.forEach(y=>{
              count2 = parseInt(y) + count2;
              this.arraySeries2?.push(parseInt(y))
            });

        });

         /* GRAFICO 3 */
        let subEtiqueta = $grafico3.filter(y=>y.subEtiquetas)[0].subEtiquetas;

        if(subEtiqueta!=""){
          let splitEtiqueta = subEtiqueta?.split('|');
          
          splitEtiqueta?.forEach(x=>{
            this.arrayEtiqueta = new Serie();
            this.arrayEtiqueta.name= x;
            this.arrayEtiqueta.data= []

            this.arrayListSerie.push(this.arrayEtiqueta);
          });         
        }

        $grafico3.forEach(x=>{
          this.arrayLabel3.push(x.etiqueta!);   

          let splitData1 = x.cantidades?.split('|')[0];
          let splitData2 = x.cantidades?.split('|')[1];
          let splitData3 = x.cantidades?.split('|')[2];       

          arraypendiente.push(parseInt(splitData1!));
          arraydono.push(parseInt(splitData2!));
          arraynodono.push(parseInt(splitData3!));

          count3 = parseInt(splitData1!) + parseInt(splitData2!) + parseInt(splitData3!) + count3;
        });

        let counts =1;
        this.arrayListSerie.forEach(x=>{
          if(counts==1){
            x.data=arraypendiente;
          }else if(counts==2){
            x.data=arraydono;
          }else if(counts==3){
            x.data=arraynodono;
          }
          counts++;
        });

        /* GRAFICO 4 */
        $grafico4.forEach(x=>{

          this.arrayLabel4.push(x.etiqueta!);
          let split = x.cantidades?.split('|');

          split!.forEach(y=>{
            count4 = parseInt(y) + count4;
            this.arraySeries4?.push(parseInt(y))
          });

        });

        /* GRAFICO 5 */
        if($grafico5.length > 0){
          let etiqsangre = $grafico5.filter(y=>y.subEtiquetas)[0].subEtiquetas;

          if(etiqsangre!=""){
            this.tiposSangre = etiqsangre!.split('|');
            let vacio = this.tiposSangre.indexOf(' ');
            if(vacio >= 0)
              this.tiposSangre[vacio] = 'N/A';
          }

          $grafico5.forEach(x=>{
            this.arrayLabel5.push(x.etiqueta!);

            let tableRowStr = x.cantidades?.split('|');
            let tableRow: number[] = [];
            tableRowStr?.forEach(el => {
              tableRow.push(parseInt(el))
            });

            //Limita las cantidades según los tipos de sangre existentes
            tableRow = tableRow.slice(0,this.tiposSangre?.length);

            this.arraySeries5?.push(tableRow!);
  
            count5 = count5 + tableRow!.reduce((a, b) => a + (b || 0), 0);
          });
        }
        

         /* VALIDADO REGISTRO PARA MOSTRAR EL GRAFICO */
        this.registro1 = (count1>0)? true: false;
        this.registro2 = (count2>0)? true: false;
        this.registro3 = (count3>0)? true: false;
        this.registro4 = (count4>0)? true: false;
        this.registro5 = (count5>0)? true: false;

        this.chart1();
        this.chart2();
        this.chart3();
        this.chart4();

      }else if (this.tipoReporte==1){
        
        this.arrayLabel1 = [];
        this.arraySeries1 = [];

        $grafico1.forEach(x=>{

          this.arrayLabel1.push(x.etiqueta!);
          let split = x.cantidades?.split('|');

          split!.forEach(y=>{
            count1 = parseInt(y) + count1;
            this.arraySeries1?.push(parseInt(y))
          });

        });

        this.registro1 = (count1>0)? true: false;
        this.chart1();

      }else if(this.tipoReporte==2){

        this.arrayLabel2 = [];
        this.arraySeries2 = [];

        $grafico2.forEach(x=>{

          this.arrayLabel2.push(x.etiqueta!);
          let split = x.cantidades?.split('|');

          split!.forEach(y=>{
            count2 = parseInt(y) + count2;
            this.arraySeries2?.push(parseInt(y))
          });

        });

        this.registro2 = (count2>0)? true: false;
        this.chart2();

      }else if(this.tipoReporte==3){

        this.arrayLabel3 = [];
        this.arraySeries3 = [];
        this.arrayListSerie = [] = [];
        this.arrayEtiqueta = {} = {};

        let subEtiqueta = $grafico3.filter(y=>y.subEtiquetas)[0].subEtiquetas;

        if(subEtiqueta!=""){
          let splitEtiqueta = subEtiqueta?.split('|');
          
          splitEtiqueta?.forEach(x=>{
            this.arrayEtiqueta = new Serie();
            this.arrayEtiqueta.name= x;
            this.arrayEtiqueta.data= []

            this.arrayListSerie.push(this.arrayEtiqueta);
          });         
        }

        $grafico3.forEach(x=>{
          this.arrayLabel3.push(x.etiqueta!);   

          let splitData1 = x.cantidades?.split('|')[0];
          let splitData2 = x.cantidades?.split('|')[1];
          let splitData3 = x.cantidades?.split('|')[2];

          arraypendiente.push(parseInt(splitData1!));
          arraydono.push(parseInt(splitData2!));
          arraynodono.push(parseInt(splitData3!));

          count3 = parseInt(splitData1!) + parseInt(splitData2!) + parseInt(splitData3!) + count3;
        });

        let counts =1;
        this.arrayListSerie.forEach(x=>{
          if(counts==1){
            x.data=arraypendiente;
          }else if(counts==2){
            x.data=arraydono;
          }else if(counts==3){
            x.data=arraynodono;
          }
          counts++;
        });

        this.registro3 = (count3>0)? true: false;
        this.chart3();

      }else if(this.tipoReporte==4){

        this.arrayLabel4 = [];
        this.arraySeries4 = [];

        $grafico4.forEach(x=>{

          this.arrayLabel4.push(x.etiqueta!);
          let split = x.cantidades?.split('|');

          split!.forEach(y=>{
            count4 = parseInt(y) + count4;
            this.arraySeries4?.push(parseInt(y))
          });

        });
      
        this.registro4 = (count4>0)? true: false;
        this.chart4();

      }
      else if(this.tipoReporte==5){

        this.arrayLabel5 = [];
        this.arraySeries5 = [];

        this.tiposSangre = [];
        
        if($grafico5.length > 0){
          let etiqsangre = $grafico5.filter(y=>y.subEtiquetas)[0].subEtiquetas;

          if(etiqsangre!=""){
            this.tiposSangre = etiqsangre!.split('|');
            let vacio = this.tiposSangre.indexOf(' ');
            if(vacio >= 0)
              this.tiposSangre[vacio] = 'N/A';
          }

          $grafico5.forEach(x=>{
            this.arrayLabel5.push(x.etiqueta!);

            let tableRowStr = x.cantidades?.split('|');
            let tableRow: number[] = [];
            tableRowStr?.forEach(el => {
              tableRow.push(parseInt(el))
            });

            //debugger;

            //Limita las cantidades según los tipos de sangre existentes
            tableRow = tableRow.slice(0,this.tiposSangre?.length);

            this.arraySeries5?.push(tableRow!);
  
            count5 = count5 + tableRow!.reduce((a, b) => a + (b || 0), 0);
          });

          this.registro5 = (count5>0)? true: false;
        }
      }

      this.spinner.hideLoading();

    });   
  }

  onDateChange(reporte: number){
    if(reporte==1){
      this.$fechaInicio = this.fechaSelectInicio1;
      this.$fechaFin=  this.fechaSelectFin1; 
      this.tipoReporte = 1;
    }
    else if(reporte==2){
      this.$fechaInicio = this.fechaSelectInicio2;
      this.$fechaFin=  this.fechaSelectFin2;
      this.tipoReporte = 2;
    } 
    else if(reporte==3){
      this.$fechaInicio = this.fechaSelectInicio3;
      this.$fechaFin=  this.fechaSelectFin3;
      this.tipoReporte = 3;
    } 
    else if(reporte==4){
      this.$fechaInicio = this.fechaSelectInicio4;
      this.$fechaFin=  this.fechaSelectFin4;
      this.tipoReporte = 4;

      if(this.$fechaInicio==null || this.$fechaFin==null){
        this.notifier.showNotification(environment.ALERT,'Mensaje','Las fechas para las cantidad de unidades son obligatorio');
      }
    }
    else if(reporte==5){
      this.$fechaInicio = this.fechaSelectInicio5;
      this.$fechaFin=  this.fechaSelectFin5;
      this.tipoReporte = 5;
    }

    this.listargrafico();  
  }

  updateTipoStock(tipo: number){
    this.$fechaInicio = this.fechaSelectInicio5;
    this.$fechaFin=  this.fechaSelectFin5;
    this.tipoReporte = 5;

    this.curTipoStock = tipo;
    this.listargrafico();  

  }

  chart1(){
    this.reportegrafico1 = {
      series: this.arraySeries1,
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.arrayLabel1,
      responsive: [
        {
          breakpoint: 450,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  chart2(){
    this.reportegrafico2 = {
      series: this.arraySeries2,
      chart: {
        width: 430,
        type: "pie"
      },
      labels: this.arrayLabel2,
      responsive: [
        {
          breakpoint: 450,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  chart3(){
    this.reportegrafico3 = {
      series: this.arrayListSerie,
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "100%",
          barHeight: '100%',
        }
      },
      dataLabels: {
        enabled: true,       
        position: 'top',
        style: {
          fontSize: '10px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold'
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.arrayLabel3
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val=String) {
            return val;
          }
        }
      }
    };
  }

  chart4(){
    this.reportegrafico4 = {
      series: this.arraySeries4,
      chart: {
        width: 430,
        type: "pie"
      },
      labels: this.arrayLabel4,
      responsive: [
        {
          breakpoint: 450,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
  
}
