import axios from 'axios';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { returnErroService } from './returnErroService';
import { buildRequestConfig } from './apiSecurityHeaders';

export const GetPaginadoService = async<T> (paginacao: PaginacaoItens<T>, url: string): 
Promise<PaginacaoItens<T> | null> => {
    try {
        const config = buildRequestConfig(url);
        const response = await axios.post(url, paginacao, config);
        return response.data.data;
    } catch (error) {
        const responseErro = returnErroService(error);
        const responseItem : PaginacaoItens<T> = {
            notifications : responseErro ?? []
        }
        return responseItem;
    }
};
