import * as React from 'react';
import { Grid } from '@mui/material';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Botao from '../../components/button';
import CampoTexto from '../../components/textbox';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import Icone from '../../components/icone';
import { SiInstagram, SiFacebook, SiGoogle } from 'react-icons/si';
import { loginUser } from '../../services/Login/loginService';
import { MensagemItens } from '../../Interfaces/Mensagens/MensagemItens';
import Mensagem from '../../components/mensagem';
import { NotificationItens } from '../../Interfaces/shared/NotificationItens';
import RecaptchaComponent from '../../components/recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import '../../assets/styles/Login/login.css';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [messageRetorno, setMessageRetorno] = useState<NotificationItens[]>([]);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isMessage, setMessage] = useState<boolean>(false);

    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(false);

        const usuario: UsuarioLoginItens = {
            usuario: login,
            senha: senha,
            recatpcha: recaptchaValue ?? ''
        };

        const usuarioLogado = await loginUser(usuario);
        setIsLoading(false);
        setMessageRetorno(usuarioLogado?.notifications ?? []);
        if (usuarioLogado?.isValid) {
            navigate('/', { state: { usuarioLogado } });
        }
        else {
            setLogin('');
            setSenha('');
        }
    };
    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
            enviarFormulario();
        }
    };

    const handleButtonClick = () => {
        const fakeEvent = {
            preventDefault: () => { }
        } as React.FormEvent;
        handleSubmit(fakeEvent);
        enviarFormulario();
    };

    const enviarFormulario = () => {
        setMessage(true)
        setTimeout(() => {
            setMessage(false);
        }, 3000);
        setIsLoading(true);
    }

    const handleCloseMessage = () => {
        setMessage(false);
    };
    const messageText = messageRetorno[messageRetorno.length - 1] ?? []
    const errorMensage: MensagemItens = {
        texto: messageText.notificationProps?.Message,
        cor: "#F6DDCC",
        isVisible: isMessage,
        onClick: handleCloseMessage
    }
    const botaoProps: BotaoItens = {
        name: 'Entrar',
        tooltip: 'Fazer o login',
        label: 'Entrar',
        onIconClick: handleButtonClick,
        width: '200px',
        color: 'primary',
        isLoading: isLoading,
    };

    return (
        <>
            <div className='banner'>
                <Banner />
            </div>

            <Grid container className="gridContainer">


                <div className='messageError'>
                    <Mensagem mensagemProps={errorMensage}></Mensagem>
                </div>
                <Grid item md={6} xs={12} className='gridEsquerdo'>
                    <div className='conteudoEsquedoLogin'>
                        <div className='itensEsquedoLogin'>
                            <h2>Seja bem vindo!</h2>
                            <p>Por favor, faça o login para acessar sua conta. Caso ainda não tenha uma você pode se cadastrar.</p>
                        </div>
                    </div>
                </Grid>
                <Grid item md={6} xs={12} className='gridDireito'>
                    <div className='conteudoDireitoLogin'>
                        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
                            <CampoTexto
                                textBoxProps={{
                                    name: "Login",
                                    tooltip: "digite seu login",
                                    label: "Login",
                                    value: login,
                                    type: 'text',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)
                                }}
                            />
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

                            <div className='recaptcha'>
                                <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                            </div>

                            <div className='botao'>
                                <Botao botaoProps={botaoProps} />
                            </div>
                        </form>
                        <div className="links-login">
                            <a href="/EsqueciaSenha" className="esqueci-link">
                                Esqueci minha senha
                            </a>
                            <a href="/perfil" className="cadastrar-link">
                                Cadastrar
                            </a>
                        </div>
                        <div className="social-icons">
                            <Icone iconeProps={{ icone: <SiInstagram />, dialogo: "Faça o login com Instagram." }} />
                            <Icone iconeProps={{ icone: <SiFacebook />, dialogo: "Faça o login com Facebook." }} />
                            <Icone iconeProps={{ icone: <SiGoogle />, dialogo: "Faça o login com Google." }} />
                        </div>
                    </div>
                </Grid>
            </Grid>

            <div>
                <Footer />
            </div>
        </>
    );
}

export default Login;
