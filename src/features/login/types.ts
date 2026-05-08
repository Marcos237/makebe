// filepath: src/features/login/types.ts

import { BotaoItens as BotaoItensOriginal } from '../../Interfaces/Botao/botao';
import { SocialIconItem as SocialIconItemOriginal } from '../../Interfaces/shared/socialIconItem';
export type { EsqueciSenhaItens } from '../../Interfaces/Usuario/EsqueciSenhaItens';

// Re-export das interfaces originais
export type { BotaoItensOriginal as BotaoItens };
export type { SocialIconItemOriginal as SocialIconItem };

export interface UsuarioLoginItens {
    usuario: string;
    senha: string;
    recaptcha: string;
}

export interface UsuarioPerfilItens {
    id: number;
    urlImagem?: string;
    nome: string;
    urlInicial: string;
}

export interface LoginResponse {
    chave?: string;
    usuarioId?: number;
    urlImagem?: string;
    nome?: string;
    urlInicial?: string;
    notifications?: NotificationItem[];
}

export interface NotificationItem {
    notificationProps?: {
        Key?: string;
        Message?: string;
    };
}

export interface ErroItem {
    Key: string;
    Mensagem: string;
}
