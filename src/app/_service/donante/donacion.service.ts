import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Donacion } from 'src/app/_model/donante/donacion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DonacionService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/donacion`;
  
  obtener(idpredonante: number,codigo:number,idbanco:number ){
    let urls = `${this.url}/GetFirstDonacion?idpredonante=${idpredonante}&codigo=${codigo}&idbanco=${idbanco}`;

    return this.http.get<Donacion>(urls);
  }

  guardar(model: Donacion){
    let urls = `${this.url}/PostSaveDonacion`;
    return this.http.post<Response>(urls, model);
  }
}
