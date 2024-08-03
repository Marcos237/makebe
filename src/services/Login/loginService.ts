import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { saveTokenToLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';

export const loginUser = async (usuario: UsuarioLoginItens): Promise<UsuarioLogadoItens | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(`${API_BASE_URL}usuario/login`, usuario, config);
        console.log(response);
        const token = response.data.sessao.chave;
        saveTokenToLocalStorage(token);
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
        const axiosError = error as AxiosError;
        if (!axios.isAxiosError(error)) {
            return null;
        }
        const erroNotifications = JSON.parse(axiosError?.response?.request.response)[0];
        const notifications : NotificationItens[] = [];
        if (erroNotifications) {
            notifications.push({
                notificationProps : {
                    Key: erroNotifications.Key,
                    Message: erroNotifications.Message,
                    IsValidate: erroNotifications.IsValid
                }
            });
        } 
        const usuarioLogadoError: UsuarioLogadoItens = {
            usuarioId: '',
            urlImagem: '',
            nome: '',
            menus: [],
            notifications: notifications,
            isValid: false
        };
        return usuarioLogadoError;
    }
};
