import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { ReenviaItens } from '../../Interfaces/Usuario/ReenviaItens';
import { ReenviatText, SucessText, UrlReenviaEmail } from '../../constants/Usuario/autenticacaoConstant';
import { API_BASE_URL, RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { MensagemItens } from "../../Interfaces/Mensagens/MensagemItens";
import { PostService } from '../../services/shared/postService';
import { FaLock } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import RecaptchaComponent from '../../components/recaptcha';
import BotaoSubmit from '../../components/submitButton';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import CampoTexto from '../../components/textbox';
import Mensagem from '../../components/mensagem';
import '../../assets/styles/Perfil/reenvia.css';

const ReenviaAutenticacao: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [isMessage, setMessage] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);
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
        const response = await PostService(reenviaItens, `${API_BASE_URL}${UrlReenviaEmail}`);

        if (response?.notifications && response.notifications.length > 0) {

            const errosConvertidos: ErroItem[] = response.notifications.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
                erroSession: n.notificationProps?.Key ?? ''
            }));

            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);
            setIsLoading(false);
            setMessage(false);
        }
        else {
            setEmail('');
            setMessage(true);
        }
        setIsLoading(false);
    };

    const handleCloseMessage = () => {
        setMessage(false);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };
    const botaoProps: BotaoItens = {
        tooltip: 'Enviar',
        isLoading: isLoading,
        icon: FaLock,
        marginLeft: '4px',
        marginRight: '4px'

    };

    const messageProps: MensagemItens = {
        texto: SucessText,
        cor: "#A3E4D7",
        onClick: handleCloseMessage
    }

    return (
        <>
            <div className='banner'>
                <Banner />
            </div>
            <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmReenvia">
                <div className='messageTextReenvia'>
                    {isMessage && (
                        <Mensagem mensagemProps={messageProps} />
                    )}
                </div>
                <Grid container className="ContainerGrid">
                    <div className='conteudo'>
                        <div className='icone-box'>
                            <div className="formItens">
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
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
                                                erroSession:'Email',
                                            }}
                                        />
                                    </div>
                                    <div className='recaptcha'>
                                        <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                    </div>

                                    <div className='botaoReenvia'>
                                        <BotaoSubmit botaoProps={botaoProps}/>
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div>
                </Grid>
            </form>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default ReenviaAutenticacao;
