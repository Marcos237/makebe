import { useCallback, useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import { EsqueciSenhaItens } from '../../Interfaces/Usuario/EsqueciSenhaItens';
import { EsqueciText, UrlEsqueciSenha } from '../../constants/Usuario/autenticacaoConstant';
import { PostService } from '../../services/shared/postService';
import { EnvioItemText } from '../../constants/Usuario/autenticacaoConstant';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig'
import { UsuarioLoginItens } from '../../Interfaces/Usuario/UsuarioLoginItens';
import { UrlUsuarioLogado } from '../../constants/Usuario/usuarioConstant';
import { API_BASE_URL } from '../../config/apiConfig';
import { GetAllService } from '../../services/shared/getAllService';
import { ResponseItem } from '../../Interfaces/shared/ResponseItem';
import { FaLock } from 'react-icons/fa';
import { ErroItem } from '../../Interfaces/shared/erroItem';
import { useFormErros } from '../../hooks/useFormErros';
import RecaptchaComponent from '../../components/recaptcha';
import BotaoSubmit from '../../components/submitButton';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import CampoTexto from '../../components/textbox';

import '../../assets/styles/Login/esqueciSenha.css';

const AlteraSenha: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');

    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);
    const [isEnviaText, setIsEnviaText] = useState(true);
    const [useUsuarioLogado, setUsuarioLogado] = useState<UsuarioLoginItens>();
    const [useIsDiseble, setIsDiseble] = useState<boolean>();
    const [useIsEnviado, setIsEnviado] = useState<boolean>();
    const [erros, setErros] = useState<ErroItem[]>([]);
    const [erroTrigger, setErroTrigger] = useState(0);

    useFormErros(erros, erroTrigger);
    const fetchData = useCallback(async () => {
        const sessao = await GetAllService(`${API_BASE_URL}${UrlUsuarioLogado}`) as ResponseItem<UsuarioLoginItens>
        setUsuarioLogado(sessao);
        if (useIsEnviado) {
            setIsLoading(false);
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
        const response = await PostService(reenviaItens, `${API_BASE_URL}${UrlEsqueciSenha}`);
        if (response?.notifications && response.notifications.length > 0) {

            setIsVisibleLogin(false)
            const errosConvertidos: ErroItem[] = response.notifications.map((n) => ({
                Key: 'CPFEmail',
                Mensagem: n.notificationProps?.Message ?? '',
            }));
            setErros(errosConvertidos);
            setErroTrigger(prev => prev + 1);

            setValue('');
        } else {
            setIsEnviado(true);
            setValue('');
            setIsEnviaText(false);   
            setIsVisibleLogin(true)
        }

        setIsLoading(false);
    };

    const handleFormKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {

        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const botaoProps: BotaoItens = {
        tooltip: 'Enviar Email',
        isLoading: isLoading,
        isDisable: useIsDiseble,
        icon: FaLock,
        marginLeft: '4px',
        marginRight: '4px'

    };

    return (
        <>
            <div className='banner'>
                <Banner usuarioLogado={useUsuarioLogado} />
            </div>

            <Grid container className="ContainerGrid">
                <div className='conteudo'>
                    <div className='icone-box'>

                        <Grid item md={6} xs={12} className='gridEsquerdo hiddenTelaPequena'>
                            <div className='conteudoEsquerdoAlteraSenha'>
                                <div className='itensEsquedoAlteraSenha'>
                                    {isVisibleLogin && (
                                        <p>{EnvioItemText} <a className='link' href='/login'>Login</a></p>
                                    )}
                                    {isEnviaText && (<p>{EsqueciText}</p>)}
                                </div>
                            </div>
                        </Grid>
                        <div className="separador"></div>
                        <Grid item md={6} xs={12} className='gridDireito'>
                            <div className='conteudoDireitoAlteraSenha'>

                                <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} id="frmAlterarSenha">
                                    <div className="formItens">
                                        <CampoTexto
                                            textBoxProps={{
                                                name: "CPFEmail",
                                                tooltip: "digite seu CPF ou Email",
                                                label: "CPF ou Email*",
                                                value: value,
                                                type: 'text',
                                                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value),
                                                erroSession:'CPFEmail'
                                            }}
                                        />
                                    </div>
                                    <div className='recaptcha'>
                                        <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                    </div>

                                    <div className='botao'>
                                        <BotaoSubmit botaoProps={botaoProps} />
                                    </div>
                                </form>
                            </div>
                        </Grid>
                    </div>
                </div>
            </Grid>
            <div>
                <Footer />
            </div>
        </>
    );
};

export default AlteraSenha;
