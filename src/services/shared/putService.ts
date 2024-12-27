import axios, { AxiosRequestConfig } from 'axios';
import { returnErroService } from './returnErroService';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';

export const PutService = async<T>(item: T, url: string): Promise<ResponseItem<T> | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        const request = JSON.stringify(item);
        const response = await axios.put(url, request, config);
        return response.data;
    } catch (error) {
        const responseErro = returnErroService(error);
        const responseItem: ResponseItem<T> = {
            notifications: responseErro ?? []
        }
        return responseItem;
    }
};
