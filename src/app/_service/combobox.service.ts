import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Combobox } from '../_model/combobox';

@Injectable({
  providedIn: 'root'
})
export class ComboboxService {

  private url: string = `${environment.UrlApi}/combobox`;

  public static combobox: Combobox = new Combobox();
  static http: any;

  constructor(private http: HttpClient) { }

  public cargarDatos(){
    let urls = `${this.url}/GetAllCombobox`;
    return this.http.get<Combobox>(urls)
  }
}
