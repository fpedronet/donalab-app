import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rptficha',
  templateUrl: './rptficha.component.html',
  styleUrls: ['./rptficha.component.css']
})
export class RptfichaComponent implements OnInit {

  window?: any;
  tipDocu?: string;
  numDocu?: string;
  apPaterno?: string;
  apMaterno?: string;
  primerNombre?: string;
  fecNacimiento?: string;
  edad?: string;
  sexo?: string;
  estadoCivil?: string;
  lugarNacimiento?: string;
  procedencia?: string;
  direccion?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  ocupacion?: string;
  telefono?: string;
  celular?: string;
  correo?: string;
  lugarTrabajo?: string;
  codigoPre?: string;
  fechaDona?: string;
  tipoDonacion?: string;
  tipoExtraccion?: string;
  personaRelacion?: string;
  grupoABO?: string;
  hemoglobina?: string;
  hematocrito?: string;
  tallaDonacion?: string;
  pesoDonacion?: string;
  presionArterial?: string = '';
  frecuenciaCardiaca?: string = '';
  viajes?: string;
  permanencia?: string;
  fechaViaje?: string;
  lesionesVenas?: string;
  estadoVenoso?: string;
  campo1A?: string;
  campo2A?: string;
  campo3A?: string;
  campo4A?: string;
  campo4B?: string = '';
  campo5A?: string;
  campo5B?: string = '';
  campo6A?: string;
  campo6B?: string = '';
  campo7A?: string;
  campo8A?: string;
  campo9A?: string;
  campo10A?: string;
  campo10B?: string = '';
  campo11A?: string;
  campo12A?: string;
  campo13A?: string;
  campo14A?: string;
  campo14B?: string = '';
  campo15A?: string;
  campo16A?: string;
  campo17A?: string;
  campo18A?: string;
  campo19A?: string;
  campo20A?: string;
  campo21A?: string;
  campo22A?: string;
  campo23A?: string;
  campo24A?: string;
  campo25A?: string;
  campo26A?: string;
  campo27A?: string;
  campo28A?: string;
  campo29A?: string;
  campo29B?: string = '';
  estado?: string;
  motivoRec?: string;
  periodoRechazo?: string;
  observacionesChec?: string;
  faseRechazo?: string;
  titulo?: string;
  subTitulo1?: string;
  subTitulo2?: string;
  logo?: string;
  codDonacion?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
