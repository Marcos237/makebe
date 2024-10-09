import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { LojaItens } from '../../Interfaces/Loja/lojaItens';

export const LojaBuscaPorIdService = async (id: number): Promise<LojaItens | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axios.get(`${API_BASE_AGENDA_URL}Loja/${id}`, config);

        return response.data.data;
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
    return {};
};