// filepath: src/features/perfil/hooks/usePerfil.ts

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { perfilService } from '../services/perfilService';
import { useUsuarioLogado } from '../../../hooks/useUsuarioLogado';
import { UsuarioPerfilItens, ErroItem } from '../types';
import { UploadItens } from '../../../Interfaces/TextBox/UploadItens';
import { useFormErros } from '../../../hooks/useFormErros';

export const usePerfil = () => {
    const navigate = useNavigate();
    const { fetchUsuarioLogado } = useUsuarioLogado();

    // State do formulário
    const [nome, setNome] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [instagram, setInstagram] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItem, setUploadItem] = useState<UploadItens>({ uploadProps: { nomeImagem: '', urlImagem: '' } });
    const [isLogado, setLogado] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<any>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);
    const [recaptchaRenderKey, setRecaptchaRenderKey] = useState(0);

    useFormErros(erros, erroTrigger);

    // Carregar dados do perfil
    const fetchPerfilData = useCallback(async () => {
        try {
            const response = await perfilService.getPerfil();

            if (response?.data) {
                setId(response.data.id ?? '');
                setNome(response.data.nome ?? '');
                setCpf(response.data.cpf ?? '');
                setEmail(response.data.email ?? '');
                setTelefone(response.data.telefone ?? '');
                setInstagram(response.data.instagram ?? '');

                setUploadItem({
                    uploadProps: {
                        nomeImagem: response.data.nomeImagem,
                        urlImagem: response.data.urlImagem,
                        id: "1",
                    },
                });

                if (response.data.id) {
                    const sessao = await fetchUsuarioLogado();
                    setUsuarioLogado(sessao);
                    setLogado(true);
                } else {
                    setLogado(false);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }, [fetchUsuarioLogado]);

    useEffect(() => {
        fetchPerfilData();
    }, [fetchPerfilData]);

    // Handlers
    const handleRecaptchaChange = useCallback((value: string | null) => {
        setRecaptchaValue(value);
    }, []);

    const handleImageUpload = useCallback((base64String: string, fileName: string) => {
        setUploadItem({
            uploadProps: {
                nomeImagem: fileName,
                urlImagem: base64String,
                id: "1",
            },
        });
    }, []);

    const handleSubmit = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const usuario: UsuarioPerfilItens = {
            id: id || '',
            urlImagem: uploadItem.uploadProps.urlImagem,
            nomeImagem: uploadItem.uploadProps.nomeImagem,
            nome: nome,
            cpf: cpf,
            email: email,
            telefone: telefone,
            instagram: instagram,
            recaptcha: recaptchaValue ?? '',
            senha: senha,
            confirmaSenha: confirmacaoSenha
        };

        try {
            let response;
            if (isLogado) {
                response = await perfilService.updatePerfil(usuario);
            } else {
                response = await perfilService.createPerfil(usuario);
            }

            if (response?.notifications && response.notifications.length > 0) {
                const errosConvertidos: ErroItem[] = response.notifications.map((n: any) => ({
                    Key: n.notificationProps?.Key ?? '',
                    Mensagem: n.notificationProps?.Message ?? '',
                    erroSession: n.notificationProps?.Key ?? ''
                }));
                setErros(errosConvertidos);
                setErroTrigger(prev => prev + 1);
                setRecaptchaValue(null);
                setRecaptchaRenderKey(prev => prev + 1);
            } else if (!isLogado) {
                navigate('/perfilValidar');
            }
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        } finally {
            setIsLoading(false);
        }
    }, [id, nome, cpf, email, telefone, instagram, senha, confirmacaoSenha, recaptchaValue, uploadItem, isLogado, navigate]);

    const handleFormKeyDown = useCallback((event: React.KeyboardEvent<HTMLFormElement>) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    }, [handleSubmit]);

    return {
        // State
        nome, setNome,
        id, setId,
        cpf, setCpf,
        email, setEmail,
        telefone, setTelefone,
        instagram, setInstagram,
        senha, setSenha,
        confirmacaoSenha, setConfirmacaoSenha,
        isLoading,
        uploadItem,
        isLogado,
        recaptchaValue,
        recaptchaRenderKey,
        useUsuarioLogadoItem,
        erros,
        erroTrigger,
        // Actions
        handleRecaptchaChange,
        handleImageUpload,
        handleSubmit,
        handleFormKeyDown,
        fetchPerfilData,
    };
};
