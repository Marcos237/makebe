import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { AutenticacaoItens } from "../../Interfaces/Usuario/AutenticacaoItens";
import { AtivarUsuario, ReenviatEmail, UrlAutenticacaoDoisFatores } from '../../constants/Usuario/autenticacaoConstant';
import { Tooltip } from '@mui/material';
import { PutService } from '../../services/shared/putService';
import { RECAPTCHA_SITE_KEY } from '../../config/apiConfig';
import { Grid } from '@mui/material';
import { API_BASE_URL } from '../../config/apiConfig';
import { FaPlay } from 'react-icons/fa';
import RecaptchaComponent from '../../components/recaptcha';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import '../../assets/styles/Perfil/autenticacao.css'


const Autenticacao: React.FC = () => {
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isVisibleReevia, setIsVisibleReevia] = useState(false);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);
    const [ativaDesativa, setAtivaDesativa] = useState<string>("ativar");
    const [classeDesativa, setClasseDesativa] = useState<string>("");


    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };
    const { chave } = useParams();
    const autenticacaoItens: AutenticacaoItens = {
        Id: chave ?? '',
        usuarioId: '',
        recaptcha: recaptchaValue ?? ''
    };

    const handleButtonClick = async (value : string) => {

        if (value === "readonly") return;


        const retorno = await PutService(autenticacaoItens ?? {}, `${API_BASE_URL}${UrlAutenticacaoDoisFatores}`);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {

            setIsVisibleLogin(true)
            setIsVisibleReevia(false)
            setAtivaDesativa("Ativado")
            setClasseDesativa("readonly")
        } else {

            setIsVisibleReevia(true)
            setIsVisibleLogin(false)
            setClasseDesativa("readonly")
        }
    }


    return (
        <>
            <div className='banner'>
                <Banner />
            </div>


            <div className="form-persitir form-custom">
                <Grid container spacing={2} className="ContainerGrid grid-custom">
                    <div className="conteudo">
                        <fieldset
                            className={'icone-box icone-box-form expandido'}>
                            <legend>{AtivarUsuario}</legend>
                            <div className='itemAutenticacao'>
                                <div className='textoAutenticacao'>

                                    {isVisibleLogin && (
                                        <p><a href='/login'>Clique aqui para fazer o login</a></p>
                                    )}
                                    {isVisibleReevia && (
                                        <p>{ReenviatEmail} <a href='/ReenviaAutenticacao'>Clique aqui</a></p>
                                    )}

                                    <div className='recaptcha'>
                                        <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                    </div>
                                    <button
                                        type="button"
                                        className={`btn-filtros ${classeDesativa}`}
                                        onClick={() => handleButtonClick(classeDesativa)

                                        }
                                    >
                                        <Tooltip title="Filtros">
                                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                {ativaDesativa}
                                                <FaPlay />
                                            </span>
                                        </Tooltip>
                                    </button>

                                </div>
                            </div>

                        </fieldset>
                    </div>
                </Grid>
            </div>


            <div>
                <Footer />
            </div>
        </>
    );
};

export default Autenticacao;
