export class Grafico {
    ideGrafico?: number;
    etiqueta?: string;
    subEtiquetas?: string;
    cantidades?: string;
    listaCantidad?: number[] = [];
}

export class Serie{
    name?: string;
    data?: number[] = [];
}

//Para las tablas de doble entrada
export class TipoStock {
    constructor(_ideGrafico: number, _descripcion: string, _titulo: string) {
        this.ideGrafico = _ideGrafico;
        this.descripcion = _descripcion;
        this.titulo = _titulo;
    }
    ideGrafico?: number;
    descripcion?: string;
    titulo?: string;
}