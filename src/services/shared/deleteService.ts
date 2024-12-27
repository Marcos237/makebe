import axios, { AxiosRequestConfig } from 'axios';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { returnErroService } from './returnErroService';

export const DeleteService = async<T>(id : string | number, url : string): Promise<ResponseItem<T>> => {

    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.delete(`${url}/${id}`, config);
        return response.data; 
    } catch (error) {
        const responseErro = returnErroService(error);
        const responseItem : ResponseItem<T> = {
            notifications : responseErro ?? []
        }
        return responseItem;
    }
}