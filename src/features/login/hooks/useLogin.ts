// filepath: src/features/login/hooks/useLogin.ts

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/loginService';
import { saveTokenToLocalStorage } from '../../../config/ArmazenaToken';
import { UsuarioLoginItens, ErroItem, UsuarioPerfilItens } from '../types';

export const useLogin = () => {
    const navigate = useNavigate();
    
    const [login, setLogin] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState<number>(0);

    const temErroLogin = erros.some(e => e.Key === 'Login');
    const messageErro = erros.find(e => e.Key === 'Login')?.Mensagem;

    const handleRecaptchaChange = useCallback((value: string | null) => {
        setRecaptchaValue(value);
    }, []);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const credentials: UsuarioLoginItens = {
            usuario: login,
            senha: senha,
            recaptcha: recaptchaValue ?? ''
        };

        try {
            const response = await loginService.authenticate(credentials);

            if (response?.notifications && response.notifications.length > 0) {
                const errosConvertidos: ErroItem[] = response.notifications.map((n: any) => ({
                    Key: n.notificationProps?.Key ?? '',
                    Mensagem: n.notificationProps?.Message ?? '',
                }));

                setErros(errosConvertidos);
                setErroTrigger(prev => prev + 1);
                setLogin('');
                setSenha('');
            } else if (response) {
                saveTokenToLocalStorage(response.chave ?? '');
                
                const usuarioLogado: UsuarioPerfilItens = {
                    id: response.usuarioId ?? 0,
                    urlImagem: response.urlImagem,
                    nome: response.nome ?? '',
                    urlInicial: response.urlInicial ?? '',
                };
                
                navigate(response.urlInicial ?? '', { state: { usuarioLogado } });
            }
        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            setIsLoading(false);
        }
    }, [login, senha, recaptchaValue, navigate]);

    const handleFormKeyDown = useCallback((event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    }, [handleSubmit]);

    const clearErrors = useCallback(() => {
        setErros([]);
    }, []);

    return {
        // State
        login,
        setLogin,
        senha,
        setSenha,
        isLoading,
        recaptchaValue,
        erros,
        erroTrigger,
        temErroLogin,
        messageErro,
        // Actions
        handleRecaptchaChange,
        handleSubmit,
        handleFormKeyDown,
        clearErrors,
    };
};