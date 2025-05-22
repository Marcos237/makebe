import { GetByIdService } from "../services/shared/getByIdService";
import { DeleteService } from "../services/shared/deleteService";
import { ResponseItem } from '../Interfaces/shared/ResponseItem';

export const handleModalDesativar = async (
    id: number,
    url: string,
    callback?: (tipoAgenda?: string, page?: number) => Promise<void>
) => {
    const response = await DeleteService(id, url);

    if (response) {
        if (callback) {
            await callback();
        }
        return true;
    }

    return false;
};

export const handleUpdateClick = async (item: any, url: string, tipo ?: number) => {
    const itemId = item.id ?? 0;
    const retorno = await GetByIdService(itemId, url, tipo) as ResponseItem<typeof item>;

    if (retorno?.data) {
        return { success: true, data: retorno.data };
    }
    
    return { success: false, message: 'Dados não encontrados ou falha na requisição' }; 
};
