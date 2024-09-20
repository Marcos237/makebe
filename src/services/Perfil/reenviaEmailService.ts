import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { ReenviaItens } from '../../Interfaces/Usuario/ReenviaItens';

export const ReenviaEmailService = async (reenvia: ReenviaItens): Promise<ReenviaItens | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(`${API_BASE_URL}AutenticacaoDoisFatores/ReenviarEmailAutenticacao`, reenvia, config);
        const reenviaItens: ReenviaItens = {
            usuarioId: response.data.sessao.usuarioId,
            email: response.data.sessao.urlImagem,
            notifications: response.data.notifications,
        };
        return reenviaItens;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const reenviaError: ReenviaItens = {
            usuarioId: '',
            email: '',
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