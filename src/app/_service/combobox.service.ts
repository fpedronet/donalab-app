import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Combobox } from '../_model/combobox';
import { dataCollection } from '../_model/dataCollection';

@Injectable({
  providedIn: 'root'
})
export class ComboboxService {

  private url: string = `${environment.UrlApi}/tablamaestra`;
  static http: any;

  constructor(private http: HttpClient) { }

  public cargarDatos(CodigosTabla: string[], IdeBanco: number, IdeUsuario: number){
    var CodTabla = CodigosTabla.join('|');
    let urls = `${this.url}/GetAllTablaMaestra?CodTabla=${CodTabla}&IdeBanco=${IdeBanco}&IdeUsuario=${IdeUsuario}`;
    return this.http.get<dataCollection>(urls);
  }
}
