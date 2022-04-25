import { Combobox } from "../combobox";

export class Donacion{

    idePreDonante?: number;
    ideDonacion?: number;
    dFechaRegistro?: Date;
    dFechaExtraccion?: Date;
    codTipoExtraccion?: string; 
    ideGrupo?: string;
    ideTipoBolsa?: string;
    ideBrazo?: string;
    ideDificultad?: string;
    ideUsuReg?: number;   
    nombres?:string;
    documento?: string;

    listaTipoExtraccion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaTipoBolsa?: Combobox[];
    listaBrazo?: Combobox[];
    listaDificultad?: Combobox[];
    listaHemoComponente?: Combobox[];
}