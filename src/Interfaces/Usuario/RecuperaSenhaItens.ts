import { NotificationItens } from "../shared/NotificationItens";

export interface RecuperaSenhaItens {
    id?: string;
    senha?: string;
    confirmaSenha?: string;
    notifications? : NotificationItens[];
    recaptcha?: string;
}