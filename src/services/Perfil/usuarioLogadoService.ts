import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';

export const UsuarioLogadoService = async (): Promise<UsuarioLogadoItens> => {

    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${API_BASE_URL}UsuarioSessao`, config);
        if(response.status === 401){
            window.location.href = '/Login';
        }
        const usuarioItem: UsuarioLogadoItens = {
                usuarioId: response?.data.usuarioId ?? '',
                urlImagem: response.data?.urlImagem ?? '',
                nome: response.data?.nome ?? '',
                menus: response.data?.menus?.map((item: any) => ({
                    id: item.id,
                    descricao: item.menuDescricao,
                    urlMenu: item.menuUrl,
                    subMenus : item.subMenus
                })) ?? [],
                notifications: response.data.notifications ?? [],
                isValid: true 
            };
            return usuarioItem;
        }catch  {
        const usuarioVazio:  UsuarioLogadoItens  = {

            usuarioId:  '',
            urlImagem:  '',
            nome:  '',
            menus: [],
            notifications: [],
            isValid: true 
        };
        return usuarioVazio;
    }
}