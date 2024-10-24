import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { API_BASE_AGENDA_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';

export const LojaExcluirService = async (id: number): Promise<Boolean> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axios.delete(`${API_BASE_AGENDA_URL}Loja/${id}`, config);
        return response.data;
    } catch (error) {
        return false;
    };
};