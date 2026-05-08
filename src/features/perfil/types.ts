// filepath: src/features/perfil/types.ts

import { BotaoItens } from '../../Interfaces/Botao/botao';
import { UploadItens } from '../../Interfaces/TextBox/UploadItens';
import { ErroItem } from '../../Interfaces/shared/erroItem';

export interface UsuarioPerfilItens {
    id?: string;
    urlImagem?: string;
    nomeImagem?: string;
    nome?: string;
    cpf?: string;
    email?: string;
    telefone?: string;
    instagram?: string;
    recaptcha?: string;
    senha?: string;
    confirmaSenha?: string;
}

export interface PerfilFormData {
    nome: string;
    id: string;
    cpf: string;
    email: string;
    telefone: string;
    instagram: string;
    senha: string;
    confirmacaoSenha: string;
}

export interface PerfilState {
    nome: string;
    id: string;
    cpf: string;
    email: string;
    telefone: string;
    instagram: string;
    senha: string;
    confirmacaoSenha: string;
    isLoading: boolean;
    uploadItem: UploadItens;
    isLogado: boolean;
    recaptchaValue: string | null;
    erros: ErroItem[];
    erroTrigger: number;
}

export type { BotaoItens, UploadItens, ErroItem };