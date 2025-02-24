import { NotificationItens } from "../shared/NotificationItens";

export interface EnderecoItens {
    id?: number;
    razaoSocial?: string;
    logradouro?: string;
    numero?: number;
    complemento?: string;
    cep?: string;
    estado?: string;
    cidade?: string;
    tipoUsuarioId?: number;
    colaboradorEnderecoId ?: number;
    lojaEnderecoId?: number;
    lojaId?: number;
    colaboradorId?: number;
    nomeColaborador?: string;
}