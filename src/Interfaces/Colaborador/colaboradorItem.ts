import { NotificationItens } from "../shared/NotificationItens";

export interface ColaboradorItens {
    id?: number;
    usuarioId?: string;
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
    permissaoId ?: string;
    descricaoPermissao? : string;
    nomeImagem?: string;
    urlImagem?: string;
    status?: boolean;
    instagram?: string;
    descricaoStatus?: string;
}