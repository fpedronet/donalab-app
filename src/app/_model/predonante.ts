export class Predonante {
    IdePreDonante?: number;
    Codigo?: number;
    Nombres?: string;
    CodEstado?: number;
    Estado?: string;
    Colorhexa?: string;
}

export class PredonanteRequest {
    Idebanco?: number;
    FechaDesde?: Date;
    FechaHasta?: Date;
    IdeEstado?: number;
    Idecampania?: number;
    IdeOrigen?: number;
    Nombres?: string;
}