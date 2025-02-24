import {SelectItens} from './selectItens'

export interface PersistirItens<T> {
    selectItems?: Array<SelectItens>,
    item?: T
    name?: string;
    id? : string;
    onSave?: () => void;
    isSave?: boolean;
}