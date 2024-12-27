import {SelectItens} from './selectItens'

export interface PersistirItens<T> {
    selectItems?: Array<SelectItens>,
    item?: T
    name?: string;
    onSave?: () => void;
}