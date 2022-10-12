import { Persona } from "../donante/persona";

export class Solicitud {
    ideSolicitud?: number;
    codSolicitud?: string;
    fecha?: Date;
    idePersona?: number;
    persona?: Persona;
    codProcedencia?: Date;
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
    Page?: number;
    Pages?:number;
}