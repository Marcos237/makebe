import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { VitrineItem } from '../../Interfaces/Vitrine/vitrineItem';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { buildRequestConfig } from '../shared/apiSecurityHeaders';

export const VitrineService = async (): Promise<VitrineItem> => {

    try {
        const url = `${API_BASE_URL}vitrine`;
        const config = buildRequestConfig(url);

        const response = await axios.get(url, config);
        const vitrineItem: VitrineItem = {
            descricao: response.data.descricao ?? '', 
        };
        return vitrineItem;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const vitrineError: VitrineItem = {
            descricao: '',
            notifications: notifications,
        };
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return vitrineError;
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

        return vitrineError;
    }
}
