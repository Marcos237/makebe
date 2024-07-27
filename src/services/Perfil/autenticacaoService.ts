import { API_BASE_URL } from '../../config/apiConfig';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { NotificationItens } from "../../Interfaces/shared/NotificationItens";
import { AutenticacaoItens } from "../../Interfaces/Usuario/AutenticacaoItens";

export const AutenticacaoService = async (autenticacao : AutenticacaoItens) : Promise<AutenticacaoItens | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await axios.post(`${API_BASE_URL}AutenticacaoDoisFatores`, autenticacao, config);
        const autenticado: AutenticacaoItens = {
            usuarioId: response.data.data.usuarioId,
            Id: response.data.data.id,
            notifications: response.data.notifications,
        };
        return autenticado;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return null;
        }
        const notifications : NotificationItens[] = [];
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
        const usuarioLogadoError: AutenticacaoItens = {
            usuarioId: '',
            Id: '',
            notifications: notifications,
        };
        return usuarioLogadoError;
    }
};
