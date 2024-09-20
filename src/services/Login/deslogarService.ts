import axios, { AxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../../config/apiConfig';
import { getTokenFromLocalStorage } from '../../config/ArmazenaToken';

export const DeslogarService = async (): Promise<boolean | null> => {
    try {
        const token = getTokenFromLocalStorage();
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        const response = await axios.get(`${API_BASE_URL}usuario/deslogar`, config);
        return response.data;
    } catch (error) {
        return false;
    }
};