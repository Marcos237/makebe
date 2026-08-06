import axios from 'axios';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { returnErroService } from './returnErroService';
import { buildRequestConfig } from './apiSecurityHeaders';

export const GetByIdService = async<T>(id : string | number, url : string, tipo?: number): Promise<ResponseItem<T>> => {

    try {
        const config = buildRequestConfig(url);
        const response = await axios.get(`${url}/${id}${tipo != null ? `/${tipo}` : ''}`, config);
        return response.data; 
    } catch (error) {
        const responseErro = returnErroService(error);
        const responseItem : ResponseItem<T> = {
            notifications : responseErro ?? []
        }
        return responseItem;
    }
}
