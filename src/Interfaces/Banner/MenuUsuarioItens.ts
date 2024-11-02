
import { SubMenusItens } from "./subMenuitens";

export interface MenuUsuarioItens {
    id: number;
    descricao:string;
    urlMenu: string;
    subMenus?: Array<SubMenusItens>
  }
  