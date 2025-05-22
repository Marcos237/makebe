import { SelectItens } from "../Interfaces/shared/selectItens";


export const getSelectedItemByTipo = (tipo: string, selectedKey: string, colaboradores: SelectItens[], lojas: SelectItens[]) => {
    switch (tipo) {
        case "colaborador":
            return colaboradores.find(item => item.key === selectedKey);
        case "loja":
            return lojas.find(item => item.key === selectedKey);
        default:
            return null;
    }
};