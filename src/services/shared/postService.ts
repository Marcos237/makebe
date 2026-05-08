import axios, { AxiosRequestConfig } from 'axios';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { returnErroService } from './returnErroService';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';

export const PostService = async <T>(  item: T, url: string): Promise<ResponseItem<T>> => {
  try {
    const token = getTokenFromLocalStorage();
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.post<ResponseItem<T>>(`${url}`, item, config);
    return response.data; 
    } catch (error) {

        const responseErro = returnErroService(error);
        const responseItem : ResponseItem<T> = {
            notifications : responseErro ?? []
        }
        return responseItem;
    }
  }