import { UsuarioService } from 'src/app/_service/usuario.service';
import { environment } from 'src/environments/environment';

import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
  public chartOptionspie!: Partial<ChartOptions>;
  public chartOptionsbar!: Partial<ChartOptions>;


  constructor(
    private usuarioService: UsuarioService
  ) { }

  arrayOp: string[] = [];
  arraySer: number[] = [];
  idEncuesta?: string;
  usuario?: string;
  
  ngOnInit(): void {
    this.usuario = this.usuarioService.sessionUsuario()?.nombre;
    this.chart1();
    this.chart2();
  }

  chart1(){
    this.chartOptionspie = {
      series: [44, 55, 0, 43, 22],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
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
    this.chartOptionsbar = {
      series: [
        {
          name: "Net Profit",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Revenue",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        },
        {
          name: "Free Cash Flow",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }
      ],
      chart: {
        type: "bar",
        height: 235
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      // yaxis: {
      //   title: {
      //     text: "$ (thousands)"
      //   }
      // },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val=String) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }

  
}
