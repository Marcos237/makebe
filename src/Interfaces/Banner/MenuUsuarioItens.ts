
import { SubMenusItens } from "./subMenuitens";

export interface MenuUsuarioItens {
    id: number;
    descricao:string;
    urlMenu: string;
    ordem?: number;
    subMenus?: Array<SubMenusItens>
  }
  