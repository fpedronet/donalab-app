export class Menu {
    url?: string;
    nombre?: string;
    icon?: string;
    vista?:boolean;
    subMenu?:SubMenu[];
}

export class SubMenu {
    url?: string;
    nombre?: string;
    icon?: string;
    vista?:boolean;
}