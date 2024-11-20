import React, { useState, useEffect } from 'react';
import {Grid } from '@mui/material';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { useNavigate } from 'react-router-dom';
import Upload from '../../components/upload';
import Botao from '../../components/button';
import CampoTexto from '../../components/textbox';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens'
import { cpfMaskConst, foneMaskConst } from '../../constants/Usuario/usuarioConstant';
import { UploadItens } from '../../Interfaces/TextBox/UploadItens';
import { GerPerfilService } from '../../services/Perfil/getPerfilService';
import { PerfilService } from '../../services/Perfil/perfilService';
import { UpdatePerfilService } from '../../services/Perfil/upDatePerfilService';
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import Mensagem from '../../components/mensagem';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { RetornarMessageService } from '../../services/Perfil/retornarMessageService';
import RecaptchaComponent from '../../components/recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService'

import '../../assets/styles/Perfil/perfil.css';

const Perfil: React.FC = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [instagran, setInstagran] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItem, setUploadItem] = useState<UploadItens>({ uploadProps: { nomeImagem: '', urlImagem: '' } });
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isLogado, setLogado] = useState<boolean>(false);
    const [isMessage, setMessage] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };


    const fetchPerfilData = async () => {
        const response = await GerPerfilService();
        setId(response?.id ?? '')
        setNome(response?.nome ?? '');
        setCpf(response?.cpf ?? '');
        setEmail(response?.email ?? '')
        setTelefone(response?.telefone ?? '')
        setUploadItem({
            uploadProps: {
                nomeImagem: response?.nomeImagem,
                urlImagem: response?.urlImagem,
                id : "1"
            },
        });
        setInstagran(response?.instagran ?? '')

        if (response.id !== '') {

            const sessao = await UsuarioLogadoService();
            setUsuarioLogado(sessao);
            setLogado(true);
        }
        else {
            setLogado(false);
        }
    };
    useEffect(() => {
        fetchPerfilData();
    }, []);

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
            instagran: instagran,
            recaptcha: recaptchaValue ?? ''
        };
        if (isLogado) {
            const usuarioLogado = await UpdatePerfilService(usuario);
            const messageRetorno = await RetornarMessageService(isLogado, useUsuarioLogado?.isValid ?? false, usuarioLogado?.notifications ?? [])
            setMessageItens(messageRetorno);
        }
        else {
            const usuarioLogado = await PerfilService(usuario);
            const messageRetorno = await RetornarMessageService(isLogado, useUsuarioLogado?.isValid ?? false, usuarioLogado?.notifications ?? [])
            setMessageItens(messageRetorno);

            if (!usuarioLogado?.notifications || usuarioLogado.notifications.length === 0) {
                navigate('/perfilValidar');
            }
        }

        enviarSatusMessage();
        setIsLoading(false);
    }
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
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

    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
    }

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }
    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
            <Grid container spacing={2} className="ContainerGrid">
                    <div className='conteudo'>
                        <div className='messageError'>
                            <Mensagem mensagemProps={messageProps}></Mensagem>
                        </div>
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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className='formItens'>
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "CPF",
                                            tooltip: "digite seu CPF",
                                            label: "CPF*",
                                            value: cpf,
                                            type: 'text',
                                            mask: cpfMaskConst,
                                            readonly: isLogado,
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)

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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setTelefone(e.target.value)
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
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)
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
                                            value: instagran,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInstagran(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className='recaptcha'>
                                    <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                </div>

                                <div className='formItens'>
                                    <div className='botao'>
                                        <Botao botaoProps={botaoProps} />
                                    </div>
                                </div>

                            </div>
                        </Grid>
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
