import { Persona } from "../donante/persona";

export class Solicitud {
    ideSolicitud?: number;
    codSolicitud?: string;
    fecha?: Date;
    idePersona?: number;
    persona?: Persona;
    codProcedencia?: string;
    codServicio?: string;
    codDiagnostico?: string;
    codMedico?: string;
    medico?: string;
    cama?: string;
    codTransPrev?: string;
    codPrioridad?: string;
    cuenta?: string;
    codReaccAdv?: string;
    codAdicional?: string;
    observaciones?: string;
    ideEstado?: number;
    estado?: string;
    listaPedidos?: SolicitudPedido[];
    listaPruebas?: SolicitudPrueba[];
}

export class SolicitudPedido {
    constructor(ideHemocomponente?: number, hemocomponente?: string, secuencia?: number, cant?: number, alicuota?: number, observaciones?: string){
        this.ideHemocomponente = ideHemocomponente;
        this.hemocomponente = hemocomponente;
        
        this.cant = cant === undefined ? 0 : cant;
        this.alicuota = alicuota === undefined ? 0 : alicuota;
        this.observaciones = observaciones === undefined ? '' : observaciones;
    }
    traspasarCampos(p: SolicitudPedido){
        this.cant = p.cant;
        this.alicuota = p.alicuota;
        this.observaciones = p.observaciones;
    }
    ideSolDetPed?: number;
    ideSolicitud?: number;
    ideHemocomponente?: number;
    hemocomponente?: string;
    cant?: number;
    alicuota?: number;
    observaciones?: string;
}

export class SolicitudPrueba {
    constructor(idePrueba?: number, prueba?: string, resultado?: string){
        this.idePrueba = idePrueba;
        this.prueba = prueba;
        this.resultado = resultado === undefined ? '' : resultado;
    }
    ideSolDetPruebaPac?: number;
    ideSolicitud?: number;
    idePrueba?: number;
    prueba?: string;
    resultado?: string;
}

export class SolicitudRequest {
    Idebanco?: number;
    dFechaDesde?: Date;
    FechaDesde?: string;
    dFechaHasta?: Date;
    FechaHasta?: string;
    IdeEstado?: number;
    Codigo?: string;
    Paciente?: string;
    CodUnidad?: string;
    CodPrioridad?: string;
    Page?: number;
    Pages?:number;
}