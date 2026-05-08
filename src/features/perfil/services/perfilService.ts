// filepath: src/features/perfil/services/perfilService.ts

import { PostService } from '../../../services/shared/postService';
import { PutService } from '../../../services/shared/putService';
import { GetAllService } from '../../../services/shared/getAllService';
import { API_BASE_URL } from '../../../config/apiConfig';
import { UrlUsuarioPerfil } from '../../../constants/Usuario/usuarioConstant';
import { UsuarioPerfilItens } from '../types';
import { ResponseItem } from '../../../Interfaces/shared/ResponseItem';

export const perfilService = {
    async getPerfil(): Promise<ResponseItem<UsuarioPerfilItens> | null> {
        const response = await GetAllService(
            `${API_BASE_URL}${UrlUsuarioPerfil}`
        ) as ResponseItem<UsuarioPerfilItens>;
        return response ?? null;
    },

    async createPerfil(usuario: UsuarioPerfilItens): Promise<ResponseItem<UsuarioPerfilItens> | null> {
        const response = await PostService(usuario, `${API_BASE_URL}${UrlUsuarioPerfil}`) as ResponseItem<UsuarioPerfilItens>;
        return response ?? null;
    },

    async updatePerfil(usuario: UsuarioPerfilItens): Promise<ResponseItem<UsuarioPerfilItens> | null> {
        const response = await PutService(usuario, `${API_BASE_URL}${UrlUsuarioPerfil}`) as ResponseItem<UsuarioPerfilItens>;
        return response ?? null;
    }
};