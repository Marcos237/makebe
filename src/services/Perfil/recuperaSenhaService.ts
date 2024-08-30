import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { RecuperaSenhaItens } from '../../Interfaces/Usuario/RecuperaSenhaItens';

export const RecuperaSenhaService = async (reenvia: RecuperaSenhaItens): Promise<RecuperaSenhaItens | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.put(`${API_BASE_URL}EsqueciSenha`, reenvia, config);
        const reenviaItens: RecuperaSenhaItens = {
            id: '',
            senha: '',
            confirmaSenha : '',
            notifications: response.data.notifications,
        };
        return reenviaItens;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const reenviaError: RecuperaSenhaItens = {
            id: '',
            senha: '',
            confirmaSenha : '',
            notifications: notifications
        };
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return reenviaError;
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

        return reenviaError;
    }
};