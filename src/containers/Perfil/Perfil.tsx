import React, { useState, useEffect } from 'react';
import { Box, Grid } from '@mui/material';
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
import Mensagem from '../../components/mensagem';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import '../../assets/styles/Perfil/perfil.css';
import { RetornarMessageService } from '../../services/Perfil/retornarMessageService';

const Perfil: React.FC = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [senha, setsenha] = useState<string>('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>('');
    const [instagran, setInstagran] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadItem, setUploadItem] = useState<UploadItens>({ uploadProps: { nomeImagem: '', urlImagem: '' } });
    const [usuarioItem, setUsuario] = useState<UsuarioLogadoItens>();
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [isLogado, setLogado] = useState<boolean>(false);
    const [isMessage, setMessage] = useState<boolean>(false);


    const fetchPerfilData = async () => {
        const response = await GerPerfilService();
        setId(response?.data?.id ?? '')
        setNome(response?.data?.nome ?? '');
        setCpf(response?.data?.cpf ?? '');
        setEmail(response?.data?.email ?? '')
        setTelefone(response?.data?.telefone ?? '')
        setUploadItem({
            uploadProps: {
                nomeImagem: response.data?.nomeImagem,
                urlImagem: response.data?.urlImagem,
            },
        });
        setInstagran(response?.data?.instagran ?? '')

        if (response.usuarioId !== '') {

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
            senha: senha,
            confirmaSenha: confirmacaoSenha,
            instagran: instagran
        };
        if (isLogado) {
            const usuarioLogado = await UpdatePerfilService(usuario);
            const messageRetorno = await RetornarMessageService(isLogado, usuarioLogado?.isValid ?? false, usuarioLogado?.notifications ?? [])
            setMessageItens(messageRetorno);
            setUsuario(usuarioLogado || undefined);
        }
        else {
            const usuarioLogado = await PerfilService(usuario);
            const messageRetorno = await RetornarMessageService(isLogado, usuarioLogado?.isValid ?? false, usuarioLogado?.notifications ?? []) 
            setMessageItens(messageRetorno);
            setUsuario(usuarioLogado || undefined);

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
                <Banner />
            </div>
            <Box>
            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>

                    <Grid container spacing={2} className="gridContainerPerfil">
                        <div className="formItens">
                            <div className='messageText'>
                                <Mensagem mensagemProps={messageProps ?? {}} />
                            </div>
                        </div>
                        <Grid item md={6} xs={12} className='gridEsquerdoPerfil'>
                            <div className='conteudoEsquerdoPerfil'>
                                <div className='camposEsquerdo'>
                                    <div className="formItens">
                                        <Upload uploadProps={uploadItem.uploadProps} onUpload={handleImageUpload} />
                                    </div>
                                    <div className="formItens">
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
                                    <div className="formItens">
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

                                    <div className="formItens">
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
                                    <div className="formItens">
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
                            </div>
                        </Grid>
                        <Grid item md={6} xs={12} className='gridDireitoPerfil'>
                            <div className='conteudoDireitoPerfil'>
                                <div className='center'></div>
                                <div className='camposDireito'>
                                    <div className="formItens ">

                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Senha",
                                                tooltip: "digite sua Senha",
                                                label: "Senha*",
                                                value: senha,
                                                type: 'password',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setsenha(e.target.value),
                                                readonly: isLogado
                                            }}
                                        />
                                    </div>
                                    <div className="formItens">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "ConfirmaSenha",
                                                tooltip: "Confirme sua Senha",
                                                label: "ConfirmaSenha*",
                                                value: confirmacaoSenha,
                                                type: 'password',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmacaoSenha(e.target.value),
                                                readonly: isLogado
                                            }}
                                        />
                                    </div>
                                    <div className="formItens">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Instagran",
                                                tooltip: "digite seu Instagran",
                                                label: "Instagran",
                                                value: instagran,
                                                type: 'text',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setInstagran(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className='formItens'>
                                        <div className='botao'>
                                            <Botao botaoProps={botaoProps} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid>

                    </Grid>
                    <div className='camposInvisiveis'>
                        <CampoTexto
                            textBoxProps={{
                                name: "id",
                                value: id,
                                type: 'hidden',
                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)
                            }} />
                    </div>
                </form>
            </Box>
            <div>
                <Footer />
            </div>
        </>
    );
}

export default Perfil;
