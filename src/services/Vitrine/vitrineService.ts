import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';
import { VitrineItem } from '../../Interfaces/Vitrine/vitrineItem';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';

export const VitrineService = async (): Promise<VitrineItem> => {

    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const response = await axios.get(`${API_BASE_URL}vitrine`, config);
        const vitrineItem: VitrineItem = {
            descricao: response.data.descricao ?? '', 
            usuarioLogadoItem: {
                usuarioId: response.data.sessao?.usuarioId ?? '',
                urlImagem: response.data.sessao?.urlImagem ?? '',
                nome: response.data.sessao?.nome ?? '',
                menus: response.data.sessao?.menus?.map((item: any) => ({
                    id: item.id,
                    descricao: item.menuDescricao,
                    urlMenu: item.menuUrl,
                })) ?? [],
                notifications: response.data.notifications ?? [],
                isValid: true 
            }
        };
        return vitrineItem;
    } catch  {
        const vitrineItemErro: VitrineItem = {
            descricao: '',
            usuarioLogadoItem: {} as UsuarioLogadoItens 
        };
        return vitrineItemErro;
    }
}