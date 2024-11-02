import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { PaginacaoItens } from '../../Interfaces/shared/PaginacaoItens';
import { LojaItens } from '../../Interfaces/Loja/lojaItens';

export const LojaPaginadoService = async (paginacao: PaginacaoItens<LojaItens>): Promise<PaginacaoItens<LojaItens> | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axios.post(`${API_BASE_AGENDA_URL}Loja/BuscarPaginado`, paginacao, config);

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