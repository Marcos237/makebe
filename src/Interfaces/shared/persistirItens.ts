import {SelectItens} from './selectItens'

export interface PersistirItens<T> {
    selectItems?: Array<SelectItens>,
    item?: T
    name?: string;
    id? : string;
    onSave?: () => void;
    onInputChange?: (texto: string) => void;
    onChangeItem?:(id:string) => void;
    isSave?: boolean;
}