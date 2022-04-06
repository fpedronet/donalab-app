import { Combobox } from "./combobox";

export class ChequeoFisico{

    idePreDonante?: number;
    codigo?: number;//ok
    fecha?: Date;//ok
    pesoDonacion?: string; //ok
    tallaDonacion?: string;//ok
    hemoglobina?: string;//ok
    hematocrito?: string;//ok
    plaquetas?: number;//ok
    presionArterial1?: string;//ok
    presionArterial2?: string;//ok
    presionArterial?: string;//ok
    frecuenciaCardiaca?: string;//ok
    ideGrupo?: number;//ok
    aspectoGeneral?: string;//ok
    lesionesVenas?: string;//ok
    estadoVenoso?: string;//ok
    obsedrvaciones?: string;//ok
    temperatura?: string;//ok
    codEstado?: number;//ok
    ideMotivoRec?: number;//ok
    ideUsuario?: number;
    aceptaAlarma?: string;
    
    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoGeneral?: Combobox[];
    listaAspectoVenoso?: Combobox[];
    listaMotivoRechazo?: Combobox[];
}