import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import Mensagem from '../../components/mensagem';
import { RecuperaText } from '../../constants/Usuario/autenticacaoConstant'
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import CampoTexto from '../../components/textbox';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { RecuperaSenhaService } from '../../services/Perfil/recuperaSenhaService'
import Botao from '../../components/button';
import RecaptchaComponent from '../../components/recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { RetornarMessageService } from '../../services/Perfil/retornarMessageService';
import {UsuarioLogadoService} from '../../services/Perfil/usuarioLogadoService'
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { RecuperaSenhaItens } from '../../Interfaces/Usuario/RecuperaSenhaItens';


import '../../assets/styles/Perfil/recuperasenha.css'

const RecuperaSenha: React.FC = () => {
    const navigate = useNavigate();
    const [messageItens, setMessageItens] = useState<MensagemItens>();
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [senha, setSenha] = useState<string>('');
    const [confirmacaoSenha, setConfirmacaoSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMessage, setMessage] = useState<boolean>(false);
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();


    const fetchData = async () => {
        const sessao = await UsuarioLogadoService();
        setUsuarioLogado(sessao);
    };
     useEffect(() => {
        fetchData();
      }, []);

    const { chave } = useParams();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const recuperaItens: RecuperaSenhaItens = {
            id: chave ?? '',
            senha: senha ?? '',
            confirmaSenha: confirmacaoSenha ?? '',
            recaptcha: recaptchaValue ?? ''
        }
        const retorno = await RecuperaSenhaService(recuperaItens);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            navigate('/login', { state: { retorno } });
        }else{
            const messageRetorno = await RetornarMessageService(false,  false, retorno?.notifications ?? [])
            setMessageItens(messageRetorno);
            enviarSatusMessage();
            setIsLoading(false);
        }
    };

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
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
    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
    };

    const messageProps: MensagemItens = {
        texto: messageItens?.texto,
        cor: messageItens?.cor,
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const botaoProps: BotaoItens = {
        name: 'Salvar',
        tooltip: 'Fazer o cadastro',
        label: 'Salvar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'primary',
        isLoading: isLoading,
    };
    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <Box>
                <form>
                    <Grid container spacing={2} className="gridContainerRecupera">

                        <div className="formItens">
                            <div className='messageText'>
                                <Mensagem mensagemProps={messageProps ?? {}} />
                            </div>
                        </div>
                        <Grid item md={6} xs={12} className='gridEsquerdoRecupera'>
                            <div className='conteudoEsquedoRecupera'>
                                <div className='itensEsquedoRecupera'>
                                    <h2>Por favor!</h2>
                                    <p>{RecuperaText}</p>
                                </div>
                            </div>
                        </Grid>

                        <Grid item md={6} xs={12} className='gridDireitoRecupera'>
                            <div className='conteudoDireitoRecupera'>
                                <form>
                                    <div className="formItensRecupera">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Senha",
                                                tooltip: "digite sua senha",
                                                label: "Senha",
                                                type: "password",
                                                value: senha,
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className="formItensRecupera">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "ConfirmaSenha",
                                                tooltip: "Confirme sua Senha",
                                                label: "Confirma Senha*",
                                                value: confirmacaoSenha,
                                                type: 'password',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setConfirmacaoSenha(e.target.value)
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

                                </form>
                            </div>
                        </Grid>
                    </Grid>
                </form>

            </Box>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default RecuperaSenha;
