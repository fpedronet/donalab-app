import { Combobox } from "../combobox";

export class ChequeoFisico{

    idePreDonante?: number;
    codigo?: number;//ok
    fecha?: Date;//ok
    pesoDonacion?: number; //ok
    tallaDonacion?: number;//ok
    hemoglobina?: number;//ok
    hematocrito?: number;//ok
    plaquetas?: number;//ok
    presionArterial1?: string;//ok
    presionArterial2?: string;//ok
    presionArterial?: string;//ok
    frecuenciaCardiaca?: number;//ok
    ideGrupo?: string;//ok
    aspectoGeneral?: string;//ok
    lesionesVenas?: string;//ok
    estadoVenoso?: string;//ok
    obsedrvaciones?: string;//ok
    temperatura?: number;//ok
    codEstado?: string;//ok
    ideMotivoRec?: number;//ok
    ideUsuario?: number;
    aceptaAlarma?: string;
    cns?: string;
    tipoExtraccion?: string;
    nombres?:string;
    documento?: string;

    listaTipoExtraccion?: Combobox[];
    listaLesionesPuncion?: Combobox[];
    listaGrupoSanguineo?: Combobox[];
    listaAspectoGeneral?: Combobox[];
    listaAspectoVenoso?: Combobox[];
    listaMotivoRechazo?: Combobox[];
}