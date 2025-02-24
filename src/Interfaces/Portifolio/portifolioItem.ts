import { PortifolioImagemItem } from "./portifolioImagemItem";

export interface PortifolioItem {
    id?: number;
    titulo?: string;
    subTitulo?: string;
    texto?: string;
    tipoUsuarioId?: number;
    colaboradorPortifolioId?: number;
    nomeColaborador?: string;
    colaboradorId?: number;
    usuarioId?: string;
    lojaPortifolioId?: number;
    razaoSocial?: string;
    lojaId?: number;
    portifolioImagens?: Array<PortifolioImagemItem>;
}