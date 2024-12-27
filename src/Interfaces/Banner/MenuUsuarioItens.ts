
import { SubMenusItens } from "./subMenuitens";

export interface MenuUsuarioItens {
    id: number;
    menuDescricao:string;
    urlMenu: string;
    ordem?: number;
    subMenus?: Array<SubMenusItens>
  }
  