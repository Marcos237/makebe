import { NotificationItens } from "../shared/NotificationItens";
import { LojaPortifolioImagemItem } from "./lojaportifolioImagemItem";

export interface LojaPortifolioItem {
    id?: number;
    lojaId?: number;
    titulo?: string;
    subTitulo?:string;
    texto?: string;
    lojaPortifolioImagens?: Array<LojaPortifolioImagemItem>;
}