import axios from 'axios';
import { returnErroService } from './returnErroService';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { buildRequestConfig } from './apiSecurityHeaders';

export const PutService = async<T>(item: T, url: string): Promise<ResponseItem<T> | null> => {
    try {
        const config = buildRequestConfig(url);
        const request = JSON.stringify(item);
        const response = await axios.put(url, request, config);
        return response.data;
    } catch (error) {
        const responseErro = returnErroService(error);
        const notifications: NotificationItens[] = responseErro?.length
            ? responseErro
            : [{
                notificationProps: {
                    Key: '',
                    Message: 'Não foi possível concluir a operação.',
                    IsValidate: false,
                }
            }];

        const responseItem: ResponseItem<T> = {
            notifications
        }
        return responseItem;
    }
};
