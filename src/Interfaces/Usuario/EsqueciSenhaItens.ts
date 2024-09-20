import { NotificationItens } from "../shared/NotificationItens";

export interface EsqueciSenhaItens {
    usuarioId?: string;
    value?: string;
    notifications? : NotificationItens[];
    recaptcha?: string;
}