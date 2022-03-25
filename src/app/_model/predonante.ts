export class Predonante {
    idePreDonante?: number;
    codigo?: number;
    nombres?: string;
    codEstado?: number;
    estado?: string;
    colorhexa?: string;
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