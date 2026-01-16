import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens'
import { UrlUsuarioPerfil } from '../../constants/Usuario/usuarioConstant';
import { cpfMaskConst, foneMaskConst } from '../../utils/mascaras';
import { UploadItens } from '../../Interfaces/TextBox/UploadItens';
import { PostService } from '../../services/shared/postService';
import { PutService } from '../../services/shared/putService';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { API_BASE_URL } from '../../config/apiConfig';
import { GetAllService } from '../../services/shared/getAllService';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { FaSave } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import { useUsuarioLogado } from "../../hooks/useUsuarioLogado";
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import RecaptchaComponent from '../../components/recaptcha';
import Upload from '../../components/upload';
import BotaoSubmit from '../../components/submitButton';
import CampoTexto from '../../components/textbox';
import React, { useState, useEffect, useCallback } from 'react';


import '../../assets/styles/Perfil/perfil.css';

const Perfil: React.FC = () => {
    const navigate = useNavigate();
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
    const [useUsuarioLogadoItem, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);
    const { fetchUsuarioLogado } = useUsuarioLogado();
    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const fetchPerfilData = useCallback(async () => {
        const response = await GetAllService(
            `${API_BASE_URL}${UrlUsuarioPerfil}`
        ) as ResponseItem<UsuarioPerilItens>;

        setId(response?.data?.id ?? '');
        setNome(response?.data?.nome ?? '');
        setCpf(response?.data?.cpf ?? '');
        setEmail(response?.data?.email ?? '');
        setTelefone(response?.data?.telefone ?? '');
        setInstagram(response?.data?.instagram ?? '');

        setUploadItem({
            uploadProps: {
                nomeImagem: response?.data?.nomeImagem,
                urlImagem: response?.data?.urlImagem,
                id: "1",
            },
        });

        if (response?.data?.id) {
            const sessao = await fetchUsuarioLogado();
            setUsuarioLogado(sessao);
            setLogado(true);
        } else {
            setLogado(false);
        }
    }, [fetchUsuarioLogado]);

    useEffect(() => {
        fetchPerfilData();
    }, [fetchPerfilData]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const usuario: UsuarioPerilItens = {
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
        if (isLogado) {
            const response = await PutService(usuario, `${API_BASE_URL}${UrlUsuarioPerfil}`) as ResponseItem<UsuarioPerilItens>;
            const errosConvertidos: ErroItem[] = response?.notifications?.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            })) ?? [];

            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
        }
        else {
            const usuarioLogado = await PostService(usuario, `${API_BASE_URL}${UrlUsuarioPerfil}`) as ResponseItem<UsuarioPerilItens>;

            if (!usuarioLogado?.notifications || usuarioLogado.notifications.length === 0) {
                navigate('/perfilValidar');
            } else {

                const errosConvertidos: ErroItem[] = usuarioLogado?.notifications?.map((n) => ({
                    Key: n.notificationProps?.Key ?? '',
                    Mensagem: n.notificationProps?.Message ?? '',
                    erroSession: n.notificationProps?.Key ?? ''
                })) ?? [];
                setErros(errosConvertidos);
                setErroTrigger(prev => prev + 1);
            }
        }
        setIsLoading(false);
    }
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handleImageUpload = (base64String: string, fileName: string) => {
        setUploadItem({
            uploadProps: {
                nomeImagem: fileName,
                urlImagem: base64String,
                id: "1",
            },
        });
    };
    const botaoProps: BotaoItens = {
        tooltip: 'Salvar',
        isLoading: isLoading,
        icon: FaSave,
        marginLeft: '4px',
        marginRight: '4px'

    };

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogadoItem} />
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmPerfil">
                <Grid container spacing={2} className="ContainerGrid">
                    <div className='conteudo'>
                        <fieldset className='icone-box icone-box-form'>
                            <legend>Perfil</legend>
                            <Grid item md={6} xs={12} className='gridEsquerdo'>
                                <div className='conteudoEsquerdoPerfil conteudoMenorEsquerdo'>
                                    <div className='formItens-imagem'>
                                        <Upload uploadProps={uploadItem.uploadProps} onUpload={handleImageUpload} />
                                    </div>
                                    <div className='formItens'>
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Nome",
                                                tooltip: "digite seu nome",
                                                label: "Nome*",
                                                value: nome,
                                                type: 'text',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value),
                                                erroSession: "Nome"
                                            }}
                                        />
                                    </div>
                                    <div className='formItens'>
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Cpf",
                                                tooltip: "digite seu CPF",
                                                label: "CPF*",
                                                value: cpf,
                                                type: 'text',
                                                mask: cpfMaskConst,
                                                readonly: isLogado,
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value),
                                                erroSession: "CPF"

                                            }}
                                        />
                                    </div>
                                    <div className='formItens'>
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Telefone",
                                                tooltip: "digite seu Telefone",
                                                label: "Telefone*",
                                                value: telefone,
                                                type: 'text',
                                                mask: foneMaskConst(telefone),
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value),
                                                erroSession: "Telefone"
                                            }}
                                        />
                                    </div>

                                    <div className='formItens'>
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Email",
                                                tooltip: "digite seu Email",
                                                label: "Email*",
                                                value: email,
                                                type: 'text',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                                erroSession: "Email"
                                            }}
                                        />
                                    </div>
                                </div>
                            </Grid>
                            <div className="separador"></div>
                            <Grid item md={6} xs={12} className='gridDireito'>
                                <div className='conteudoDiretirPerfil conteudoMenorDireito'>
                                    <div className="formItens">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Instagram",
                                                tooltip: "digite seu Instagram",
                                                label: "Instagram",
                                                value: instagram,
                                                type: 'text',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInstagram(e.target.value)
                                            }}
                                        />
                                    </div>

                                    {!isLogado && (
                                        <>
                                            <div className="formItens">
                                                <CampoTexto
                                                    textBoxProps={{
                                                        name: "Senha",
                                                        tooltip: "digite sua senha",
                                                        label: "Senha",
                                                        value: senha,
                                                        type: 'password',
                                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value),
                                                        erroSession: "Senha"
                                                    }}
                                                />
                                            </div>

                                            <div className="formItens">
                                                <CampoTexto
                                                    textBoxProps={{
                                                        name: "ConfirmaSenha",
                                                        tooltip: "digite sua confirmação de senha",
                                                        label: "confirmação da senha",
                                                        value: confirmacaoSenha,
                                                        type: 'password',
                                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmacaoSenha(e.target.value),
                                                        erroSession: "ConfirmaSenha"
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}


                                    <div className='recaptcha'>
                                        <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                    </div>

                                    <div className='formItens'>
                                        <div className='botao botao-salvar'>
                                            <BotaoSubmit botaoProps={botaoProps} />
                                        </div>
                                    </div>

                                </div>
                            </Grid>
                        </fieldset >
                    </div>
                </Grid >
                <div className='camposInvisiveis'>
                    <CampoTexto
                        textBoxProps={{
                            name: "id",
                            value: id,
                            type: 'hidden',
                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)
                        }} />
                </div>
            </form >

            < div >
                <Footer />
            </div >
        </>
    );
}

export default Perfil;
