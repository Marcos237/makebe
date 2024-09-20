import { API_BASE_URL } from '../../config/apiConfig';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { NotificationItens } from "../../Interfaces/shared/NotificationItens";
import { AutenticacaoItens } from "../../Interfaces/Usuario/AutenticacaoItens";
import { UsuarioPerfilAtivoItens } from '../../Interfaces/Usuario/UsuarioPerfilAtivoItens';

export const AtivaPerfilService = async (autenticacao: AutenticacaoItens): Promise<AutenticacaoItens | null> => {
    try {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const usuario: UsuarioPerfilAtivoItens = {
            id: autenticacao.Id || '',
            recaptcha : autenticacao.recaptcha ?? ''
        }
        const response = await axios.put(`${API_BASE_URL}AutenticacaoDoisFatores`, usuario, config);
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
        const notifications: NotificationItens[] = [];
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
        const usuarioLogadoError: AutenticacaoItens = {
            usuarioId: '',
            Id: '',
            notifications: notifications,
        };
        return usuarioLogadoError;
    }
};
