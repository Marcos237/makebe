import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { saveTokenToLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens';

export const loginUser = async (usuario: UsuarioLoginItens): Promise<UsuarioPerilItens | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(`${API_BASE_URL}usuario/login`, usuario, config);
        const token = response.data.sessao.chave;
        console.log(token)
        saveTokenToLocalStorage(token);
        const usuarioLogado: UsuarioPerilItens = {
            id: response.data.sessao.usuarioId,
            urlImagem: response.data.sessao.urlImagem,
            nome: response.data.sessao.nome,
            notifications: response.data.notifications
        };
        return usuarioLogado;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const usuarioPerfilError: UsuarioPerilItens = {
            id: '',
            urlImagem: '',
            nome: '',
            notifications: notifications ?? [],

        };
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return usuarioPerfilError;
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
        return usuarioPerfilError;
    }
};
