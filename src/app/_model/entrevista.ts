import { Combobox } from "./combobox";
import { Pregunta } from "./pregunta";

export class Entrevista{

    idePreDonante?: number;
    codigo?: number;
    ideUsuario?: number;
    fecha?: Date;
    observaciones?: string;
    codEstado?: number;
    ideMotivoRec?: number;
    
    listaPregunta?: Pregunta[];
    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoVenoso?: Combobox[];
}