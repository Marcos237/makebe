import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { TipoLojaItens } from '../../Interfaces/Loja/tipoLojaItens'
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';

export const TipoLojaService = async (): Promise<Array<TipoLojaItens> | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axios.get(`${API_BASE_AGENDA_URL}TipoLoja`, config);
        return response.data.datas;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return null;
        }
        const notifications: NotificationItens[] = [];
        const erroNotifications = JSON.parse(axiosError?.response?.request.response) as Array<{ Key: string; Message: string; IsValidate: boolean }>;
        if (Array.isArray(erroNotifications)) {
            erroNotifications.forEach(erroNotification => {
                notifications.push({
                    notificationProps: {
                        Key: erroNotification?.Key,
                        Message: erroNotification?.Message,
                        IsValidate: erroNotification?.IsValidate
                    }
                });
            });
        }
    };
    return [];
};