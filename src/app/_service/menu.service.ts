import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { MenuResponse } from '../_model/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

    
  private url: string = `${environment.UrlApi}/menu`;
  
  listar(id: number) {
    let urls = `${this.url}/GetAllOpcionMenu?id=${id}`;
    return this.http.get<MenuResponse>(urls);
  }

}
