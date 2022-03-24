export class MenuResponse {
    listaMenu?:MenuDto[];
    listaOpcionesMenu?:OpcionMenuDto[];
}

export class MenuDto {
    ideAcceso?: string;
    codModulo?: string;
    modulo?: string;
    codPantalla?:string;
    pantalla?:string;
    Permiso?:string;
    listaSubMenu?:SubMenuDto[]
}

export class SubMenuDto {
    ideAcceso?: string;
    codModulo?: string;
    modulo?: string;
    codPantalla?:string;
    pantalla?:string;
    Permiso?:string;
}

export class OpcionMenuDto {
    ideAcceso?: string;
    codModulo?: string;
    modulo?: string;
    codPantalla?:string;
    pantalla?:string;
    Permiso?:string;
}
