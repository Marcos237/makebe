import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens';


export const GerPerfilService = async (): Promise<UsuarioPerilItens> => {

    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${API_BASE_URL}UsuarioPerfil/`, config);
        const usuarioPerfil: UsuarioPerilItens = {
            id: response.data.data.id,
            nome: response.data.data.nome,
            cpf: response.data.data.cpf,
            email: response.data.data.email,
            telefone: response.data.data.telefone,
            instagran: response.data.instagran,
            senha: response.data.data.senha,
            confirmaSenha:response.data.data.confirmaSenha,
            nomeImagem:response.data.data.nomeImagem,
            urlImagem:response.data.data.urlImagem,
            recaptcha:response.data.data.recaptcha,
            notifications: response.data.notifications,

        };

        return usuarioPerfil;
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
    }};