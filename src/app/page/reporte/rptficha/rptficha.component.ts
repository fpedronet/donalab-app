import { Component, OnInit } from '@angular/core';
import { Ficha } from 'src/app/_model/reporte/ficha';

@Component({
  selector: 'app-rptficha',
  templateUrl: './rptficha.component.html',
  styleUrls: ['./rptficha.component.css']
})
export class RptfichaComponent implements OnInit {

  window?: any;
  tipDocu?: string = 'DNI';
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
  otrosRecepcion?: string;
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

  //Fórmulas
  xVoluntario?: string;
  xAutologo?: string;
  xReposicion?: string;
  xDirigida?: string;
  xSangre?: string;
  xAferesis?: string;
  xApto?: string;
  xNoAptoTemp?: string;
  xNoAptoPerm?: string;
  apPatFase1?: string;
  apMatFase1?: string;
  nombresFase1?: string;
  apPatFase2?: string;
  apMatFase2?: string;
  nombresFase2?: string;
  motivoTem?: string;
  motivoPerm?: string;
  subTitulo?: string;

  constructor() {

  }

  ngOnInit(): void {
  }

  setFicha(data: Ficha){
    this.tipDocu = '';
    this.numDocu = data.numDocu;
    this.apPaterno = data.apPaterno;
    this.apMaterno = data.apMaterno;
    this.primerNombre = data.primerNombre;
    this.fecNacimiento = data.vFecNacimiento;
    this.edad = data.edad;
    this.sexo = data.sexo;
    this.estadoCivil = data.estadoCivil;
    this.lugarNacimiento = data.lugarNacimiento;
    this.procedencia = data.procedencia;
    this.direccion = data.direccion;
    this.distrito = data.distrito;
    this.provincia = data.provincia;
    this.departamento = data.departamento;
    this.ocupacion = data.ocupacion;
    this.telefono = data.telefono;
    this.celular = data.celular;
    this.correo = data.correo1;
    this.lugarTrabajo = data.lugarTrabajo;
    this.codigoPre = data.codigoPre;
    this.fechaDona = data.vFechaDona;
    this.tipoDonacion = data.tipoDonacion;
    this.tipoExtraccion = data.tipoExtraccion;
    this.personaRelacion = data.personaRelacion;
    this.otrosRecepcion = data.otrosRecepcion;
    this.grupoABO = data.grupoABO;
    this.hemoglobina = data.hemoglobina;
    this.hematocrito = data.hematocrito;
    this.tallaDonacion = data.tallaDonacion;
    this.pesoDonacion = data.pesoDonacion;
    this.presionArterial = '';
    this.frecuenciaCardiaca = '';
    this.viajes = data.viajes;
    this.permanencia = data.permanencia;
    this.fechaViaje = data.vFechaViaje;
    this.lesionesVenas = data.lesionesVenas;
    this.estadoVenoso = data.estadoVenoso;
    this.campo1A = data.campo1A;
    this.campo2A = data.campo2A;
    this.campo3A = data.campo3A;
    this.campo4A = data.campo4A;
    this.campo4B = '';
    this.campo5A = data.campo5A;
    this.campo5B = '';
    this.campo6A = data.campo6A;
    this.campo6B = '';
    this.campo7A = data.campo7A;
    this.campo8A = data.campo8A;
    this.campo9A = data.campo9A;
    this.campo10A = data.campo10A;
    this.campo10B = '';
    this.campo11A = data.campo11A;
    this.campo12A = data.campo12A;
    this.campo13A = data.campo13A;
    this.campo14A = data.campo14A;
    this.campo14B = '';
    this.campo15A = data.campo15A;
    this.campo16A = data.campo16A;
    this.campo17A = data.campo17A;
    this.campo18A = data.campo18A;
    this.campo19A = data.campo19A;
    this.campo20A = data.campo20A;
    this.campo21A = data.campo21A;
    this.campo22A = data.campo22A;
    this.campo23A = data.campo23A;
    this.campo24A = data.campo24A;
    this.campo25A = data.campo25A;
    this.campo26A = data.campo26A;
    this.campo27A = data.campo27A;
    this.campo28A = data.campo28A;
    this.campo29A = data.campo29A;
    this.campo29B = '';
    this.estado = data.estado;
    this.motivoRec = data.motivoRec;
    this.periodoRechazo = data.periodoRechazo;
    this.observacionesChec = data.observacionesChec;
    this.faseRechazo = data.faseRechazo;
    this.titulo = data.titulo;
    this.subTitulo1 = data.subTitulo1;
    this.subTitulo2 = data.subTitulo2;
    this.logo = data.strLogo;
    this.codDonacion = data.codDonacion;

    //Fórmulas
    this.subTitulo = this.subTitulo1 + ' ' + this.subTitulo2;
    this.xVoluntario = this.tipoDonacion==='Voluntario'?'X':'';
    this.xAutologo = this.tipoDonacion==='Autologo'?'X':'';
    this.xReposicion = this.tipoDonacion==='Reposicion'?'X':'';
    this.xDirigida = this.tipoDonacion==='Dirigida'?'X':'';;
    this.xSangre = this.tipoExtraccion==='Sangre Total'?'X':'';
    this.xAferesis = this.tipoExtraccion==='Aferesis'?'X':'';
    this.xApto = this.estado==='APTO'?'X':'';
    this.xNoAptoTemp = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='T')?'X':'';
    this.xNoAptoPerm = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='D')?'X':'';
    this.apPatFase1 = (this.estado==='NO APTO' && this.faseRechazo=='1')?this.apPaterno:'';
    this.apMatFase1 = (this.estado==='NO APTO' && this.faseRechazo=='1')?this.apMaterno:'';
    this.nombresFase1 = (this.estado==='NO APTO' && this.faseRechazo=='1')?this.primerNombre:'';
    this.apPatFase2 = (this.estado==='NO APTO' && this.faseRechazo=='2')?this.apPaterno:'';
    this.apMatFase2 = (this.estado==='NO APTO' && this.faseRechazo=='2')?this.apMaterno:'';
    this.nombresFase2 = (this.estado==='NO APTO' && this.faseRechazo=='2')?this.primerNombre:'';
    this.motivoTem = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='T')?this.motivoRec:'';
    this.motivoPerm = (this.estado==='NO APTO' && this.faseRechazo=='2' && this.periodoRechazo==='D')?this.motivoRec:'';
  }

}
