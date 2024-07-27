import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';

export const UpdatePerfilService = async (usuario: UsuarioPerilItens): Promise<UsuarioLogadoItens | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.put(`${API_BASE_URL}UsuarioPerfil/`, usuario, config);
        const usuarioLogado: UsuarioLogadoItens = {
            usuarioId: response.data.sessao.usuarioId,
            urlImagem: response.data.sessao.urlImagem,
            nome: response.data.sessao.nome,
            menus: response.data.sessao.menus.map((item: any) => ({
                id: item.id,
                descricao: item.menuDescricao,
                urlMenu: item.menuUrl,
            })),
            notifications: response.data.notifications,
            isValid: true
        };
        return usuarioLogado;
    } catch (error) {
        const notifications: NotificationItens[] = [];
        const usuarioLogadoError: UsuarioLogadoItens = {
            usuarioId: '',
            urlImagem: '',
            nome: '',
            menus: [],
            notifications: notifications,
            isValid: false
        };
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return usuarioLogadoError;
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

        return usuarioLogadoError;
    }
};