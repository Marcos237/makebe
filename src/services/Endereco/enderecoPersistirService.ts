import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { EnderecoItens } from '../../Interfaces/Endereco/enderecoItens';

export const EnderecoPersistirService = async (enderecoItem: EnderecoItens): Promise<EnderecoItens | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.post(`${API_BASE_AGENDA_URL}Endereco/`, enderecoItem, config);
        return response.data.datas;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const lojaError: EnderecoItens = {
            notifications: notifications ?? []
        }
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return lojaError;
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
        return lojaError;
    };
};