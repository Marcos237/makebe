import { SelectItens } from "../shared/selectItens";
import { SelectChangeEvent } from '@mui/material/Select';

export interface DropDownItens {
    label? : string,
    placeholder?: string,
    itens?: Array<SelectItens>,
    name?: string,
    selectedId?: string | number;
    isLeitura?: boolean;
    onChange?: (event: SelectChangeEvent<string>) => void;
}

