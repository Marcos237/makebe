
import { SubMenusItens } from "./subMenuitens";

export interface MenuUsuarioItens {
    id: number;
    menuDescricao:string;
    menuUrl: string;
    ordem?: number;
    subMenus?: Array<SubMenusItens>
  }
  