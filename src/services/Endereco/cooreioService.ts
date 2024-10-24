import axios from 'axios';
import { EnderecoItens } from '../../Interfaces/Endereco/enderecoItens';

const correiosApi = axios.create({
    baseURL: 'https://viacep.com.br/ws',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const BuscarDadosCorreios = async (cep: string): Promise<EnderecoItens | null> => {
    try {
        const response = await correiosApi.get(`/${cep}/json/`);

        const endereco: EnderecoItens = {
            cep: response.data.cep,
            logradouro : response.data.logradouro,
            cidade : response.data.localidade,
            estado : response.data.estado
        }

        return endereco;
    } catch (error) {
        console.error('Erro ao buscar dados dos Correios:', error);
        throw error;
    }
};
