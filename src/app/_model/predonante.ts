import { Combobox } from "./combobox";
import { Persona } from "./persona";

export class Predonante {
    idePreDonante?: number;
    codigo?: number;
    ideBanco?: number;
    campania?: number;
    fecha?: Date;
    idePersona?: number;
    persona?: Persona;
    codTipoDonacion?: string;
    codTipoExtraccion?: string;
    idePersonaRelacion?: number;
    codParentesco?: string;
    codEje?: string;
    ideGrupo?: number;
    grupoABO?: string;
    hemoglobina?: number;
    hematocrito?: number;
    tallaDonacion?: number;
    pesoDonacion?: number;
    presionArterial?: string;
    frecuenciaCardiaca?: number;
    viajes?: string;
    permanencia?: string;
    fechaViaje?: Date;
    otros?: string;
    aspectoGeneral?: string;
    lesionesVenas?: string;
    estadoVenoso?: string;
    ideUsuReg?: number;
    ideusuRegMod?: number;
    fechaRegMod?: Date;
    ideUsuarioCheckeo?: number;
    ideUsuarioCheckeoMod?: number;
    fechaCheckeo?: Date;
    fechaCheckeoMod?: Date;
    ideUsuarioMed?: number;
    ideusuarioMedMod?: number;
    fechaMed?: Date;
    fechaMedMod?: Date;
    observacionesChec?: string;
    observacionesMed?: string;
    //Atributos para listado
    nombres?: string;
    codEstado?: number;
    estado?: string;
    colorhexa?: string;
    //
    ideMotivoRec?: number;
    motivoRec?: string;
    periodoRechazo?: string;
    rechazoHasta?: Date;
    estadoFase1?: string;
    codTubuladura?: string;
    ideUsuRechaza?: number;
    fechaRechaza?: Date;
    donReiterado?: number;
    viajeSN?: string;
    pbaRdaHBcAC?: string;
    tipRecep?: string;
    nroHistoria?: string;
    nroCuenta?: string;
    financiamiento?: string;
    ideOrigen?: number;
    ideTipProc?: string;
    temperatura?: number;
    codDonanteLIS?: string;
    plaquetas?: number;

    listaBanco?: Combobox[];
    listaCampania?: Combobox[];
    listaOrigen?: Combobox[];
    listaEstado?: Combobox[];
}

export class PredonanteRequest {
    Idebanco?: number;
    //dFechaDesde?: Date;
    FechaDesde?: Date;
    //dFechaHasta?: Date;
    FechaHasta?: Date;
    IdeEstado?: number;
    Idecampania?: number;
    IdeOrigen?: number;
    Nombres?: string;
}