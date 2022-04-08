import { Combobox } from "./combobox";
import { Pregunta } from "./pregunta";

export class Entrevista{

    idePreDonante?: number;
    codigo?: number;
    ideUsuario?: number;
    codEstado?: string;
    ideMotivoRec?: number;//ok
    pesoDonacion?: number;//ok
    hemoglobina?: number; //ok
    nIdTipoProceso?: number;
    tallaDonacion?: number;//ok
    hematocrito?: number;//ok
    tipoExtraccion?: string;//ok
    ideGrupo?: string;//ok
    estadoVenoso?: string;//ok
    lesionesVenas?: string;//ok
    fechaMed?: Date;//ok
    observacionesMed?: string;//ok
    nombres?:string;//ok
    documento?: string;//ok
    
    listaPregunta?: Pregunta[];
    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoVenoso?: Combobox[];
}