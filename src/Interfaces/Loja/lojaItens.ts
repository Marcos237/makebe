import { NotificationItens } from "../shared/NotificationItens";
export interface LojaItens {

    id?: number;
    razaoSocial?: string;
    cnpj?: string;
    email?: string
    telefone?: string;
    tipoLojaId?: number
    tipoLojaDescricao? : string;
    notifications? : NotificationItens[];
}