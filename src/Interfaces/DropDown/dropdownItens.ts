import { SelectItens } from "../shared/selectItens";
import { SelectChangeEvent } from '@mui/material/Select';

export interface DropDownItens {
    label? : string,
    placeholder?: string,
    itens?: Array<SelectItens>,
    name?: string,
    selectedId?: string | number;
    isLeitura?: boolean;
    isTextRead?: boolean;
    onInputChange?: (texto: string) => void;
    onChangeItem?:(id:string) => void;
    onChange?: (event: SelectChangeEvent<string>) => void;
    erroSession?: string;
    id?:string;
    value?: string;
}

