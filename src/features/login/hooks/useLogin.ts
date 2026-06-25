// filepath: src/features/login/hooks/useLogin.ts

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginService } from '../services/loginService';
import { saveTokenToLocalStorage } from '../../../config/ArmazenaToken';
import { UsuarioLoginItens, ErroItem } from '../types';
import { useFormErros } from '../../../hooks/useFormErros';
import { mapNotificationErrors } from '../../../utils/mapNotificationErrors';

export const useLogin = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState<number>(0);
    const [recaptchaRenderKey, setRecaptchaRenderKey] = useState<number>(0);

    useFormErros(erros, erroTrigger);

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

            if (!response) {
                return;
            }

            if (response.notifications && response.notifications.length > 0) {
                const errosConvertidos: ErroItem[] = mapNotificationErrors(response.notifications);

                setErros(errosConvertidos);
                setErroTrigger(prev => prev + 1);
                setRecaptchaValue(null);
                setRecaptchaRenderKey(prev => prev + 1);
                setLogin('');
                setSenha('');
            } else {
                const responseItem = response.data;

                saveTokenToLocalStorage(responseItem?.chave ?? '');
                setErros([]);

                window.location.replace('/vitrine');
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
        recaptchaRenderKey,
        erros,
        erroTrigger,
        // Actions
        handleRecaptchaChange,
        handleSubmit,
        handleFormKeyDown,
        clearErrors,
    };
};
