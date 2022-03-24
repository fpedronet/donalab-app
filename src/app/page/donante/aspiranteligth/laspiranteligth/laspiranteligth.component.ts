import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, startWith, switchMap } from 'rxjs';
import { Combobox } from 'src/app/_model/combobox';
import { Persona } from 'src/app/_model/persona';
import { Predonante, PredonanteRequest } from 'src/app/_model/predonante';
import { ComboboxService } from 'src/app/_service/combobox.service';
import { PredonanteService } from 'src/app/_service/predonante.service';
import { NotifierService } from '../../../component/notifier/notifier.service';
import { SpinnerService } from '../../../component/spinner/spinner.service';

@Component({
  selector: 'app-laspirantelight',
  templateUrl: './laspiranteligth.component.html',
  styleUrls: ['./laspiranteligth.component.css']
})
export class LaspiranteligthComponent implements OnInit {

  combo?: Combobox;

  dataSource: Predonante[] = [];
  displayedColumns: string[] = ['Codigo', 'Nombres', 'Estado', 'Accion'];
  loading = false;
  existRegistro = false;
  countRegistro = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private spinner: SpinnerService,
    private notifier: NotifierService,
    private comboboxService: ComboboxService,
    private predonanteService: PredonanteService
  ) { }

  ngOnInit(): void {
    // this.listarCombo();
  }

  ngAfterViewInit(request: PredonanteRequest){
    // this.predonanteService = new PredonanteService(this.http);
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // this.spinner.showLoading();

    /*merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.predonanteService!.listarLight(
            data,
            finicio,
            ffin,
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(res => {

           this.loading = false;
           this.existRegistro = res === null;

          if (res === null) {
            return [];
          }

          this.countRegistro = res.pagination.total;
          return res.items;
        }),
      ).subscribe(data => (this.dataSource = data));*/

      // this.predonanteService!.listarLight(request).subscribe(data=>{
      //   if(data === undefined){
      //     this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      //   }
      //   else{
      //     this.dataSource = data.items;
      //   }      
      //   this.spinner.hideLoading();
      // });
  }

  listarCombo(){
    this.spinner.showLoading();
    
    this.comboboxService.cargarDatos().subscribe(data=>{
      if(data === undefined){
        this.notifier.showNotification(0,'Mensaje','Error en el servidor');
      }
      else{
        this.combo = data;
      }      
      this.spinner.hideLoading();

      //Precargar DNI
    });
  }

}
