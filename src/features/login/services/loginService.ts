// filepath: src/features/login/services/loginService.ts

import { PostService } from '../../../services/shared/postService';
import { API_BASE_URL } from '../../../config/apiConfig';
import { UrlDeslogar, UrlLogin } from '../../../constants/login/loginConstant';
import { UrlEsqueciSenha } from '../../../constants/Usuario/autenticacaoConstant';
import { UrlUsuarioLogado } from '../../../constants/Usuario/usuarioConstant';
import { EsqueciSenhaItens, LoginResponse, UsuarioLoginItens } from '../types';
import { GetAllService } from '../../../services/shared/getAllService';
import { ResponseItem } from '../../../Interfaces/shared/ResponseItem';

export const loginService = {
    async authenticate(credentials: UsuarioLoginItens): Promise<LoginResponse | null> {
        const response = await PostService(credentials, `${API_BASE_URL}${UrlLogin}`);
        return response as LoginResponse;
    },

    async logout(): Promise<void> {
        await GetAllService(`${API_BASE_URL}${UrlDeslogar}`);
    },

    async getUsuarioLogado(): Promise<ResponseItem<UsuarioLoginItens>> {
        return GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as Promise<ResponseItem<UsuarioLoginItens>>;
    },

    async solicitarAlteracaoSenha(payload: EsqueciSenhaItens): Promise<any> {
        return PostService(payload, `${API_BASE_URL}${UrlEsqueciSenha}`);
    }
};
