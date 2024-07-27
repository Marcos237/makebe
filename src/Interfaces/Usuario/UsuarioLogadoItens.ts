import { NotificationItens } from "../shared/NotificationItens";
import { MenuUsuarioItens } from "../Banner/MenuUsuarioItens";
import { UsuarioPerilItens } from "./UsuarioPerilItens";

export interface UsuarioLogadoItens {
    usuarioId: string;
    urlImagem: string;
    nome: string;
    menus: MenuUsuarioItens[];
    isValid: boolean;
    data? : UsuarioPerilItens
    notifications : NotificationItens[];
}