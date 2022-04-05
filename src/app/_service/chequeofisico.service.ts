import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChequeoFisico } from '../_model/chequeofisico';

@Injectable({
  providedIn: 'root'
})
export class ChequeofisicoService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/chequeofisico`;
  
  obtener(idPersona: number){
    let urls = `${this.url}/GetFirstChequeFisico?idPersona=${idPersona}`;

    return this.http.get<ChequeoFisico>(urls);
  }

  guardar(model: ChequeoFisico){
    let urls = `${this.url}/PostSaveChequeoFisico`;
    return this.http.post<Response>(urls, model);
  }

}
