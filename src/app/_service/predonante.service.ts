import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Predonante, PredonanteRequest } from 'src/app/_model/predonante';
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
}