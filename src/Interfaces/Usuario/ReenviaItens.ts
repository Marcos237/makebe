import { NotificationItens } from "../shared/NotificationItens";

export interface ReenviaItens {
    usuarioId?: string;
    email?: string;
    notifications? : NotificationItens[];
}