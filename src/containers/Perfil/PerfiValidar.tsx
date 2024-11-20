import React from 'react';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { MensagemCadastro } from '../../constants/Usuario/usuarioConstant';
import '../../assets/styles/Perfil/perfilValidar.css'
import { Grid } from '@mui/material';

const PerfilValidar: React.FC = () => {
    return <>
        <div className='banner'>
            <Banner />
        </div>
        <Grid container className="ContainerGrid">
            <div className='conteudo'>
                <div className='itemValidar'>
                    <div className='textoValidar'>
                        <h2>Obrigado por cadastrar!</h2>
                        <p>{MensagemCadastro}</p>
                        <a href='/login'> clique aqui para fazer o login</a>
                    </div>
                </div>
            </div>
        </Grid>
        <div>
            <Footer />
        </div>
    </>

}

export default PerfilValidar;