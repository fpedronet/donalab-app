import { Combobox } from "./combobox";
import { Pregunta } from "./pregunta";

export class Entrevista{

    idePreDonante?: number;
    codigo?: number;
    ideUsuario?: number;
    codEstado?: number;
    ideMotivoRec?: number;
    pesoDonacion?: number;
    hemoglobina?: number;
    nIdTipoProceso?: number;
    tallaDonacion?: number;
    hematocrito?: number;
    nIdTipoExtraccion?: string;
    ideGrupo?: string;
    estadoVenoso?: string;
    lesionesVenas?: string;
    fechaMed?: Date;
    observacionesMed?: string;
    
    listaPregunta?: Pregunta[];
    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoVenoso?: Combobox[];
}