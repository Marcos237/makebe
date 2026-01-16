import React from 'react';
import Banner from '../../components/banner';
import Footer from '../../components/footer';
import { MensagemCadastro } from '../../constants/Usuario/usuarioConstant';
import { Grid } from '@mui/material';
import '../../assets/styles/Perfil/perfilValidar.css'

const PerfilValidar: React.FC = () => {
    return <>
        <div className='banner'>
            <Banner />
        </div>
        <Grid container className="ContainerGrid">
            <div className='conteudo'>
                <div className='icone-box'>
                    <div className='itemValidar'>
                        <div className='textoValidar'>
                            <h2>Obrigado por cadastrar!</h2>
                            <p>{MensagemCadastro}</p>
                            <a className='link' href='/login'> clique aqui para fazer o login</a>
                        </div>
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