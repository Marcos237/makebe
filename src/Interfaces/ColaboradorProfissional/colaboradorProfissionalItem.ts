export interface ColaboradorProfissionalServicoItem {
    id?: number;
    idColaborador?: number;
    idServico?: number;
    ativo?: boolean;
}

export interface ColaboradorProfissionalItem {
    id?: number;
    colaboradorId?: number;
    usuarioId?: string;
    lojaId?: number;
    servicoId?: number;
    servicos?: ColaboradorProfissionalServicoItem[];
    descricao?: string;
    PeriodoInativoInicioExtenso?: string;
    PeriodoInativoFimExtenso?: string;
    nomeColaborador?: string;
    razaoSocial?: string;
    descricaoServico?: string;
}