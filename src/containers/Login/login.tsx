import { Grid } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { PostService } from '../../services/shared/postService';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { API_BASE_URL } from '../../config/apiConfig';
import { UrlLogin } from '../../constants/login/loginConstant';
import { saveTokenToLocalStorage } from '../../config/ArmazenaToken';
import { UsuarioPerilItens } from '../../Interfaces/Usuario/UsuarioPerilItens'
import { Tooltip } from '@mui/material';
import { FaKey, FaUserPlus } from 'react-icons/fa';
import { FaLock } from 'react-icons/fa';
import { SocialIconItem } from '../../Interfaces/shared/socialIconItem';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import SocialIcons from '../../components/socialIcons';
import BotaoSubmit from '../../components/submitButton';
import RecaptchaComponent from '../../components/recaptcha';
import CampoTexto from '../../components/textbox';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import * as React from 'react';

import '../../assets/styles/Login/login.css';


const Login: React.FC = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [erros, setErros] = useState<ErroItem[]>([]);
    const temErroLogin = erros.some(e => e.Key === 'Login');
    const messageErro = erros.find(e => e.Key === 'Login')?.Mensagem;
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);
    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(false);

        const usuario: UsuarioLoginItens = {
            usuario: login,
            senha: senha,
            recaptcha: recaptchaValue ?? ''
        };

        const response = (await PostService(usuario, `${API_BASE_URL}${UrlLogin}`));
        saveTokenToLocalStorage(response?.data?.chave ?? '');
        const usuarioLogado: UsuarioPerilItens = {
            id: response?.data?.usuarioId,
            urlImagem: response?.data?.urlImagem,
            nome: response?.data?.nome,
            urlInicial: response?.data?.urlInicial,
        };
        setIsLoading(false);
        if (response?.notifications && response.notifications.length > 0) {
            const errosConvertidos: ErroItem[] = response.notifications.map((n) => ({
                Key: n.notificationProps?.Key ?? '',
                Mensagem: n.notificationProps?.Message ?? '',
            }));

            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);

        }

        if (!response?.notifications || response?.notifications?.length === 0) {
            navigate(response?.data?.urlInicial ?? '', { state: { usuarioLogado } });
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


    const enviarFormulario = () => {
        setTimeout(() => {
        }, 3000);
        setIsLoading(true);
    }

    const botaoProps: BotaoItens = {
        tooltip: 'Fazer o login',
        icon: FaKey,
        isLoading: isLoading,
        classIcone: 'icone-rotacionado',
        marginLeft: '4px',
        marginRight: '4px'
    };

    const propsIcons: SocialIconItem = {
        height: '20px',
        width: '20px'
    }
    return (
        <>
            <div className='banner'>
                <Banner />
            </div>
            <div className="form-persitir">
                <Grid container spacing={2} className="ContainerGrid">
                    <div className="conteudo">
                        <fieldset
                            className={'icone-box icone-box-form expandido'}>
                            <legend>Login</legend>
                            <Grid item md={6} xs={12} className=''>
                                <div className='conteudoEsquerdoLogin'>
                                    <div className='itensEsquedoLogin'>
                                        <h2>Seja bem vindo!</h2>
                                        <p>Por favor, faça o login para acessar sua conta. Caso ainda não tenha uma você pode se cadastrar.</p>
                                    </div>
                                </div>

                                <div className="social-icons">
                                    <SocialIcons props={propsIcons} />
                                </div>
                            </Grid>
                            <div className="separador"></div>
                            <Grid item md={6} xs={12} className='gridDireito'>
                                <div className="links-login">
                                    <a href="/AlteraSenha" className="esqueci-link">
                                        <Tooltip title="Recuperar acesso">
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <FaLock />
                                            </span>
                                        </Tooltip>
                                    </a>

                                    <a href="/perfil" className="cadastrar-link">
                                        <Tooltip title="Criar nova conta">
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                <FaUserPlus />
                                            </span>
                                        </Tooltip>
                                    </a>
                                </div>

                                <div className='conteudoDireitoLogin'>
                                    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmLogin">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Login",
                                                tooltip: "digite seu login",
                                                label: "Login",
                                                value: login,
                                                type: 'text',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value),
                                                errorClass: temErroLogin ? 'input-error' : '',
                                                messageErro: messageErro,
                                                erroSession: 'Login',
                                            }}
                                        />
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "Senha",
                                                tooltip: "digite sua senha",
                                                label: "Senha",
                                                type: "password",
                                                value: senha,
                                                erroSession: 'Senha',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)
                                            }}
                                        />

                                        <div className='recaptcha'>
                                            <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                        </div>

                                        <div className='botao botao-salvar'>
                                            <BotaoSubmit botaoProps={botaoProps} />
                                        </div>
                                    </form>
                                </div> 
                            </Grid>
                        </fieldset>
                    </div>
                </Grid>
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
}

export default Login;
