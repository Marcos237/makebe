import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { ColaboradorItens } from '../../Interfaces/Colaborador/colaboradorItem';

export const PersistirColaboradorService = async (colaboradoritem: ColaboradorItens): Promise<ColaboradorItens | any> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.post(`${API_BASE_AGENDA_URL}Colaborador/`, colaboradoritem, config);
        return response;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const colaboradorError: ColaboradorItens = {
            notifications: notifications ?? [],
            status: false
        }
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return colaboradorError;
        }
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
        return colaboradorError;
    };
};