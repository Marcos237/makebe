import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { AutenticacaoItens } from "../../Interfaces/Usuario/AutenticacaoItens";
import { AtivarUsuario, ReenviatEmail } from '../../constants/Usuario/autenticacaoConstant';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import Botao from '../../components/button';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { AtivaPerfilService } from '../../services/Perfil/ativarPerfilService';
import RecaptchaComponent from '../../components/recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig';
import { Grid } from '@mui/material';
import '../../assets/styles/Perfil/autenticacao.css'


const Autenticacao: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isVisibleReevia, setIsVisibleReevia] = useState(false);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);


    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };
    const { chave } = useParams();
    const autenticacaoItens: AutenticacaoItens = {
        Id: chave ?? '',
        usuarioId: '',
        recaptcha: recaptchaValue ?? ''
    };

    const handleButtonClick = async () => {
        setIsLoading(true);
        setIsDisabled(false);

        const retorno = await AtivaPerfilService(autenticacaoItens ?? {});
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            setIsDisabled(true);
            setIsLoading(true);
            setIsVisibleLogin(true)
        } else {
            setIsLoading(false);
            setIsVisibleReevia(true)
        }
    }

    const botaoProps: BotaoItens = {
        name: 'Ativar',
        tooltip: 'Ativar usuario',
        label: 'Ativar',
        width: '100px',
        onIconClick: handleButtonClick,
        color: 'info',
        isLoading: isLoading,
        isDisable: isDisabled
    };

    return (
        <>
            <div className='banner'>
                <Banner />
            </div>


            <Grid container className="ContainerGrid">
                <div className='conteudo'>
                    <div className='itemAutenticacao'>
                        <div className='textoAutenticacao'>

                            {isVisibleLogin && (
                                <p>{AtivarUsuario} <a href='/login'>Clique aqui para fazer o login</a></p>
                            )}
                            {isVisibleReevia && (
                                <p>{ReenviatEmail} <a href='/ReenviaAutenticacao'>Clique aqui</a></p>
                            )}

                            <div className='recaptcha'>
                                <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                            </div>
                            <div className='botaoAutenticacao'>
                                <Botao botaoProps={botaoProps}></Botao>
                            </div>
                        </div>
                    </div>
                </div>
            </Grid>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default Autenticacao;
