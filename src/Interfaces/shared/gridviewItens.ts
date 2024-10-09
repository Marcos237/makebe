import { ButtonItens } from '../shared/buttonsItens'
import { PaginacaoItens } from './PaginacaoItens';

export interface GrigViewItens<T> {
    propertyLabels?: { [key: string]: string };
    actionButtons?: ButtonItens[];
    paginacao?: PaginacaoItens<T>;
    onPageChange?: (event: React.ChangeEvent<unknown>, page: number) => void;

}