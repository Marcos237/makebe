import { useCallback, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { EsqueciSenhaItens } from '../../Interfaces/Usuario/EsqueciSenhaItens';
import { EsqueciText, SucessText } from '../../constants/Usuario/autenticacaoConstant';
import Botao from '../../components/button';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { EsqueciSenhaService } from '../../services/Login/esqueciSenhaService'
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import RecaptchaComponent from '../../components/recaptcha';
import { EnvioItemText } from '../../constants/Usuario/autenticacaoConstant';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { UsuarioLogadoItens } from '../../Interfaces/Usuario/UsuarioLogadoItens';
import { UsuarioLogadoService } from '../../services/Perfil/usuarioLogadoService';

import '../../assets/styles/Login/esqueciSenha.css';

const AlteraSenha: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [messageRetorno, setMessageRetorno] = useState<NotificationItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);
    const [isEnviaText, setIsEnviaText] = useState(true);
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLogadoItens>();
    const [useIsDiseble, setIsDiseble] = useState<boolean>();
    const [useIsEnviado, setIsEnviado] = useState<boolean>();


    const fetchData = useCallback(async () => {
        const sessao = await UsuarioLogadoService();
        setUsuarioLogado(sessao);
        if (useIsEnviado) {
            setIsLoading(true);
            setIsDiseble(true);
        }
    }, [useIsEnviado]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const reenviaItens: EsqueciSenhaItens = {
            usuarioId: '',
            value: value,
            recaptcha: recaptchaValue ?? ''
        };
        const response = await EsqueciSenhaService(reenviaItens);
        setIsVisibleLogin(true)
        setIsEnviaText(false)

        if (response?.notifications && response.notifications.length > 0) {

            const erroEmail = response.notifications[0];
            setMessageRetorno(erroEmail);
            setValue('');
        } else {
            setIsEnviado(true);
            setValue('');
        }

        setIsLoading(false);
    };

    const handleCloseMessage = () => {
        setMessage(false);
    };


    const enviarSatusMessage = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 6000);
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
        enviarSatusMessage();
    };

    const botaoProps: BotaoItens = {
        name: 'Enviar',
        tooltip: 'Enviar Email',
        label: 'Enviar',
        width: '200px',
        onIconClick: handleButtonClick,
        color: 'info',
        isLoading: isLoading,
        isDisable: useIsDiseble

    };

    const messagePropsErro: MensagemItens = {
        texto: messageRetorno?.notificationProps.Message,
        cor: "#F6DDCC",
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    const messageProps: MensagemItens = {
        texto: SucessText,
        cor: "#A3E4D7",
        isVisible: isMessage,
        onClick: handleCloseMessage
    }

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <Grid container className="ContainerGrid">
                <div className='conteudo'>
                    <div className='messageError'>
                        <Mensagem mensagemProps={messageRetorno?.notificationProps ? messagePropsErro : messageProps} />
                    </div>
                    <Grid item md={6} xs={12} className='gridEsquerdo hiddenTelaPequena'>
                        <div className='conteudoEsquerdoAlteraSenha'>
                            <div className='itensEsquedoAlteraSenha'>
                                {isVisibleLogin && (
                                    <p>{EnvioItemText} <a href='/login'>Login</a></p>
                                )}
                                {isEnviaText && (<p>{EsqueciText}</p>)}
                            </div>
                        </div>
                    </Grid>
                    <div className="separador"></div>
                    <Grid item md={6} xs={12} className='gridDireito'>
                        <div className='conteudoDireitoAlteraSenha'>

                            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
                                <div className="formItens">
                                    <CampoTexto
                                        textBoxProps={{
                                            name: "CPF ou Email",
                                            tooltip: "digite seu CPF ou Email",
                                            label: "CPF ou Email*",
                                            value: value,
                                            type: 'text',
                                            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className='recaptcha'>
                                    <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                </div>

                                <div className='botaoReenvia'>
                                    <Botao botaoProps={botaoProps}></Botao>
                                </div>
                            </form>
                        </div>
                    </Grid>
                </div>
            </Grid>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default AlteraSenha;
