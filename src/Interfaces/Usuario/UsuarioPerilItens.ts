import { NotificationItens } from "../shared/NotificationItens";

export interface UsuarioPerilItens {
    id?: string;
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
    instagram?: string;
    senha?: string;
    confirmaSenha?: string;
    nomeImagem?: string;
    urlImagem?: string;
    recaptcha?: string;
    permissaoId?: string;
    servicoId?: number;
    urlInicial?: string;
    notifications?: NotificationItens[]
}