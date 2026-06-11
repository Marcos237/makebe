import { NotificationItens } from "../shared/NotificationItens";

export interface ColaboradorProfissionalItem {
    id?: number;
    colaboradorId?: number;
    usuarioId?: string;
    lojaId?: number;
    servicoId?: number;
    descricao?: string;
    PeriodoInativoInicioExtenso?: string;
    PeriodoInativoFimExtenso?: string;
    nomeColaborador?: string;
    razaoSocial?: string;
    descricaoServico?: string;
}
