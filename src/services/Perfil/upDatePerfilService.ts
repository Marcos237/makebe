import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';

export const UpdatePerfilService = async (usuario: UsuarioPerilItens): Promise<UsuarioPerilItens | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.put(`${API_BASE_URL}UsuarioPerfil/`, usuario, config);
        const UsuarioPerfil: UsuarioPerilItens = {
            id: response.data.sessao.usuarioId,
            urlImagem: response.data.sessao.urlImagem,
            nome: response.data.sessao.nome,
            notifications: response.data.notifications,
        };
        return UsuarioPerfil;
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
        const response = axiosError?.response?.request?.response;
        if (response) {
            const erroNotifications = JSON.parse(response) as Array<{ Key: string; Message: string; IsValidate: boolean }>;

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
        }
        return usuarioPerfilError;
    }
};