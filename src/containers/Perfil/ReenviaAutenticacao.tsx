import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { ReenviaItens } from '../../Interfaces/Usuario/ReenviaItens';
import { ReenviatText, SucessText } from '../../constants/Usuario/autenticacaoConstant';
import Botao from '../../components/button';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { ReenviaEmailService } from '../../services/Perfil/reenviaEmailService'
import '../../assets/styles/Perfil/reenvia.css';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import RecaptchaComponent from '../../components/recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'

const ReenviaAutenticacao: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [messageRetorno, setMessageRetorno] = useState<NotificationItens>();
    const [isMessage, setMessage] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);


    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        const reenviaItens: ReenviaItens = {
            usuarioId: '',
            email: email,
            recaptcha: recaptchaValue ?? ''
        };
        const response = await ReenviaEmailService(reenviaItens);

        if (response?.notifications) {

            const erroEmail = response.notifications[0];
            setMessageRetorno(erroEmail)
        }
        else {
            setEmail('');
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
        isLoading: isLoading
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
                <Banner />
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
                <Grid container className="ContainerGrid">
                    <div className='conteudo'>

                        <div className="formItens">
                            <div className='messageTextReenvia'>
                                <Mensagem mensagemProps={messageRetorno?.notificationProps ? messagePropsErro : messageProps} />

                            </div>
                        </div>
                        <div className='itemReenvia'>
                            <div className='textoReenvia'>
                                <p>{ReenviatText}</p>
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
                                <div className='recaptcha'>
                                    <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                </div>

                                <div className='botaoReenvia'>
                                    <Botao botaoProps={botaoProps}></Botao>
                                </div>
                            </div>
                        </div>
                    </div >
                </Grid>
            </form>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default ReenviaAutenticacao;
