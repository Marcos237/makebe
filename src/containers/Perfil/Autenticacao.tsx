import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { AutenticacaoService } from "../../services/Perfil/autenticacaoService";
import { AutenticacaoItens } from "../../Interfaces/Usuario/AutenticacaoItens";
import { AtivarUsuario } from '../../constants/Usuario/autenticacaoConstant';
import { BotaoItens } from '../../Interfaces/Botao/botao';
import Botao from '../../components/button';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { AtivaPerfilService } from '../../services/Perfil/ativarPerfilService';
import '../../assets/styles/Perfil/autenticacao.css'


const Autenticacao: React.FC = () => {
    const navigate = useNavigate();
    const { chave } = useParams<{ chave: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const autenticacaoItens: AutenticacaoItens = {
        Id: chave ?? '',
        usuarioId: ''
    };
    const fetchAutenticacaoData = async () => {
        const response = await AutenticacaoService(autenticacaoItens)
        if (!response?.notifications || response?.notifications?.length > 0) {
            navigate('/reenviaAutenticacao/');
        }
        autenticacaoItens.Id = response?.usuarioId ?? '';
    }

    useEffect(() => {
        fetchAutenticacaoData();
    }, []);

    const handleButtonClick = async () => {
        setIsLoading(true);
        setIsDisabled(false);

        const retorno = await AtivaPerfilService(autenticacaoItens.Id ?? '');
        if (!retorno?.notifications || retorno?.notifications?.length == 0) {
            setIsDisabled(true);
            setIsLoading(true);
        }else{
            setIsLoading(false);
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
            <div className='conteudoAutenticacao'>
                <div className='itemAutenticacao'>
                    <div className='textoAutenticacao'>
                        <p>{AtivarUsuario} <a href='/login'> Clique aqui para fazer o login</a></p>
                        <div className='botaoAutenticacao'>
                            <Botao botaoProps={botaoProps}></Botao>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <Footer />
            </div>
        </>
    );
};

export default Autenticacao;
