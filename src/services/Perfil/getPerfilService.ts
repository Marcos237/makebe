import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';


export const GerPerfilService = async (): Promise<UsuarioLogadoItens> => {

    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${API_BASE_URL}UsuarioPerfil/`, config);
        const usuarioLogado: UsuarioLogadoItens = {
            usuarioId: response.data.sessao.usuarioId,
            urlImagem: response.data.sessao.urlImagem,
            nome: response.data.sessao.nome,
            menus: response.data.sessao.menus.map((item: any) => ({
                id: item.id,
                descricao: item.menuDescricao,
                urlMenu: item.menuUrl,
            })),
            data: response.data.data,
            notifications: response.data.notifications,
            isValid: true
        };
        
        return usuarioLogado;
    } catch (error) {
        const usuarioLogadoError: UsuarioLogadoItens = {
            usuarioId: '',
            urlImagem: '',
            nome: '',
            menus: [],
            notifications: [],
            isValid: false
        };
        const axiosError = error as AxiosError;
        if (!axiosError?.response?.request.response) {
            return usuarioLogadoError;
        }
        const erroNotification = JSON.parse(axiosError?.response?.request.response) as NotificationItens[];
        if (erroNotification) {
            usuarioLogadoError.notifications = erroNotification;
            return usuarioLogadoError;
        }

        return usuarioLogadoError;
    }
};