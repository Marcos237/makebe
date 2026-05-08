import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { AutenticacaoItens } from "../../../Interfaces/Usuario/AutenticacaoItens";
import { ReenviatEmail, UrlAutenticacaoDoisFatores } from '../../../constants/Usuario/autenticacaoConstant';
import { Tooltip } from '@mui/material';
import { PutService } from '../../../services/shared/putService';
import { RECAPTCHA_SITE_KEY, API_BASE_URL } from '../../../config/apiConfig';
import { FaPlay } from 'react-icons/fa';
import RecaptchaComponent from '../../../components/recaptcha';
import Banner from '../../../components/banner';
import Footer from '../../../components/footer';
import styles from './Autenticacao.module.css';

const Autenticacao: React.FC = () => {
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
    const [isVisibleReevia, setIsVisibleReevia] = useState(false);
    const [isVisibleLogin, setIsVisibleLogin] = useState(false);
    const [ativaDesativa, setAtivaDesativa] = useState<string>("ativar");
    const [classeDesativa, setClasseDesativa] = useState<string>("");
    const { chave } = useParams();
    const autenticacaoItens: AutenticacaoItens = {
        Id: chave ?? '',
        usuarioId: '',
        recaptcha: recaptchaValue ?? ''
    };
    const handleRecaptchaChange = (value: string | null) => {
        setRecaptchaValue(value);
    };
    const handleButtonClick = async (value: string) => {
        if (value === "readonly") return;
        const retorno = await PutService(autenticacaoItens ?? {}, `${API_BASE_URL}${UrlAutenticacaoDoisFatores}`);
        if (!retorno?.notifications || retorno?.notifications?.length === 0) {
            setIsVisibleLogin(true);
            setIsVisibleReevia(false);
            setAtivaDesativa("Ativado");
            setClasseDesativa("readonly");
        } else {
            setIsVisibleReevia(true);
            setIsVisibleLogin(false);
            setClasseDesativa("readonly");
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.banner}>
                <Banner />
            </div>

            <div className={styles.formPersistir}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        <h2>Autenticação</h2>
                        <p>Confirme seus dados</p>
                    </div>

                    <form className={styles.form}>
                        <div className={styles.campos}>
                            <div className={styles.info}>
                                {isVisibleLogin && (
                                    <p><a className={styles.link} href='/login'>Clique aqui para fazer o login</a></p>
                                )}
                                {isVisibleReevia && (
                                    <p>{ReenviatEmail} <a className={styles.link} href='/ReenviaAutenticacao'>Clique aqui</a></p>
                                )}
                            </div>

                            <div className={styles.recaptcha}>
                                <RecaptchaComponent siteKey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                            </div>

                            <div className={styles.botaoArea}>
                                <button
                                    type="button"
                                    className={classeDesativa ? `${styles.botao} ${styles.readonly}` : styles.botao}
                                    onClick={() => handleButtonClick(classeDesativa)}
                                >
                                    <Tooltip title="Filtros">
                                        <span className={styles.botaoConteudo}>
                                            {ativaDesativa}
                                            <FaPlay />
                                        </span>
                                    </Tooltip>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className={styles.footer}>
                <Footer />
            </div>
        </div>
    );
};
export default Autenticacao;
