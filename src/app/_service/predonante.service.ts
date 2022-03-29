import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Predonante, PredonanteRequest } from 'src/app/_model/predonante';
import { Response } from 'src/app/_model/response';
import { dataCollection } from '../_model/dataCollection';

@Injectable({
  providedIn: 'root'
})
export class PredonanteService {

  constructor(private http: HttpClient) {} 
  
  private url: string = `${environment.UrlApi}/predonante`;

  listarLight(req: PredonanteRequest) {
    let urls = `${this.url}/GetAllPredonanteLight`;

    return this.http.post<dataCollection>(urls,req);
  }

  guardar(model: Predonante){
    let urls = `${this.url}/PostSavePredonante`;
    return this.http.post<Response>(urls, model);
  }

  obtenerFiltro(codigobanco: number) {
    let urls = `${this.url}/GetBusquedaPredonanteLight?idbanco=`+codigobanco;

    return this.http.get<Predonante>(urls);
  }
}
