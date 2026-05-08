import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import { FaKey, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { useLogin } from '../hooks/useLogin';
import SocialIcons from '../../../components/socialIcons';
import BotaoSubmit from '../../../components/submitButton';
import RecaptchaComponent from '../../../components/recaptcha';
import CampoTexto from '../../../components/textbox';
import Banner from '../../../components/banner';
import Footer from '../../../components/footer';
import { RECAPTCHA_SITE_KEY } from '../../../config/apiConfig';
import { BotaoItens, SocialIconItem } from '../types';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
    const {
        login,
        setLogin,
        senha,
        setSenha,
        isLoading,
        temErroLogin,
        messageErro,
        handleRecaptchaChange,
        handleSubmit,
        handleFormKeyDown,
    } = useLogin();

    const [mostrarSenha, setMostrarSenha] = useState(false);

    const toggleSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

const botaoProps: BotaoItens = {
    tooltip: 'Fazer o login',
    icon: FaKey,
    isLoading: isLoading,
    classIcone: styles.iconeRotacionado,
    className: styles.botaoCustom, 
    variantStyle: 'primary',
    marginLeft: '4px',
    marginRight: '4px',
    name: 'Entrar'
};

    const propsIcons: SocialIconItem = {
        height: '20px',
        width: '20px'
    };

    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Banner />
            </div>

            <div className={styles.formPersistir}>
                <div className={styles.card}>
                    
                    {/* HEADER */}
                    <div className={styles.header}>
                        <h2>Olá!</h2>
                        <p>Faça login para continuar</p>
                    </div>

                    {/* FORM */}
                    <form 
                        onSubmit={handleSubmit} 
                        onKeyDown={handleFormKeyDown} 
                        id="frmLogin" 
                        className={styles.form}
                    >
                        <div className={styles.campos}>
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
                                    type: mostrarSenha ? 'text' : 'password',
                                    value: senha,
                                    erroSession: 'Senha',
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value),
                                    icon: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={toggleSenha}
                                                edge="end"
                                                className={styles.botaoOlho}
                                                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                                            >
                                                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        {/* RECAPTCHA */}
                        <div className={styles.recaptcha}>
                            <RecaptchaComponent 
                                siteKey={RECAPTCHA_SITE_KEY} 
                                onChange={handleRecaptchaChange} 
                            />
                        </div>

                        {/* BOTÃO LOGIN */}
                        <div className={styles.botaoArea}>
                            <BotaoSubmit botaoProps={botaoProps} />
                        </div>

                        {/* AÇÕES (AQUI ESTÁ O AJUSTE PRINCIPAL) */}
                        <div className={styles.acoes}>
                            <a href="/AlteraSenha" className={styles.esqueciLink}>
                                <FaLock />
                                <span>Esqueci minha senha</span>
                            </a>

                            <a href="/perfil" className={styles.cadastrarBotao}>
                                <FaUser />
                                <span>Criar conta</span>
                            </a>
                        </div>
                    </form>

                    {/* DIVISOR */}
                    <div className={styles.divisor}>
                        <span>ou</span>
                    </div>

                    {/* SOCIAL */}
                    <div className={styles.socialIcons}>
                        <SocialIcons props={propsIcons} />
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};

export default LoginForm;