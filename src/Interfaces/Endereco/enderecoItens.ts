import { NotificationItens } from "../shared/NotificationItens";

export interface EnderecoItens {
    id?: number;
    lojaId?: number;
    razaoSocial?: string;
    logradouro?: string;
    numero?: number;
    complemento?: string;
    cep?: string;
    estado?: string;
    cidade?: string;
    notifications?: NotificationItens[]
}