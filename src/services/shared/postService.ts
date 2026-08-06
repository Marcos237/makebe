import axios from 'axios';
import { returnErroService } from './returnErroService';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { buildRequestConfig } from './apiSecurityHeaders';

export const PostService = async <T>(  item: T, url: string): Promise<ResponseItem<T>> => {
  try {
    const config = buildRequestConfig(url);

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
