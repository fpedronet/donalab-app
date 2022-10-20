import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { dataCollection } from 'src/app/_model/dataCollection';
import { Persona } from 'src/app/_model/donante/persona';
import { Solicitud, SolicitudRequest } from 'src/app/_model/paciente/solicitud';
import { environment } from 'src/environments/environment';
import { Response } from '../../_model/response';


@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = `${environment.UrlApi}/solicitud`;

  listar(idbanco: number, ideestado: number, codigo: string, paciente : string, codunidad: string, fechadesde: Date, fechahasta: Date, codPrioridad: string, page: number,pages: number) {
    let req = new SolicitudRequest();
    
    req.Idebanco = idbanco;
    req.IdeEstado= ideestado;
    req.Codigo= codigo;
    req.Paciente = paciente;
    req.CodUnidad= codunidad;
    req.CodPrioridad= codPrioridad;
    
    req.FechaDesde= (fechadesde==undefined)? '' : fechadesde.toISOString().split('T')[0];
    req.FechaHasta = (fechahasta==undefined)? '' : fechahasta.toISOString().split('T')[0];

    req.Page = page+1;
    req.Pages = pages;
   
    let urls = `${this.url}/GetAllSolicitud`;
    return this.http.post<dataCollection>(urls,req);
  }

  obtener(id: number){
    let urls = `${this.url}/GetFirstSolicitud?id=${id}`;

    return this.http.get<Solicitud>(urls);
  }

  obtenerPersona(idPersona: number, tipoDocu: string = '', numDocu: string = ''){
    let urls = `${this.url}/GetFirstPersona?idPersona=${idPersona}&tipoDocu=${tipoDocu}&numDocu=${numDocu}`;

    return this.http.get<Persona>(urls);
  }

  guardar(model: Solicitud){
    //debugger;
    let urls = `${this.url}/PostSaveSolicitud`;
    return this.http.post<Response>(urls, model);
  }

  cancelar(id: number){
    let urls = `${this.url}/PostDeleteSolicitud?id=${id}`;

    return this.http.get<Response>(urls);
  }
}
