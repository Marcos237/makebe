import axios, { AxiosRequestConfig } from 'axios';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { returnErroService } from './returnErroService';

export const GetPaginadoService = async<T> (paginacao: PaginacaoItens<T>, url: string): 
Promise<PaginacaoItens<T> | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
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