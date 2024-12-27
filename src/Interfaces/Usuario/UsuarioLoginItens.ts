import { MenuUsuarioItens } from "../Banner/MenuUsuarioItens";
import { UsuarioPerilItens } from "./UsuarioPerilItens";

export interface UsuarioLoginItens {
    usuario?: string;
    chave?: string;
    senha?: string;
    recaptcha?: string
    usuarioId?: string;
    urlImagem?: string;
    nome?: string;
    menus?: MenuUsuarioItens[];
    isValid?: boolean;
    data?: UsuarioPerilItens
    urlInicial?: string;
}