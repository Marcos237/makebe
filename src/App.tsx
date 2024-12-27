import React from 'react';
import { Routes, Route , Navigate} from 'react-router-dom';
import Home from './containers/Home/home';
import Login from './containers/Login/login';
import Perfil from './containers/Perfil/Perfil';
import PerfilValidar from './containers/Perfil/PerfiValidar';
import Deslogar from './containers/Login/deslogar';
import Autenticacao from './containers/Perfil/Autenticacao'
import ReenviaAutenticacao from './containers/Perfil/ReenviaAutenticacao';
import AlteraSenha from './containers/Login/alterasenha'
import RecuperaSenha from './containers/Perfil/RecuperaSenha';
import Salao from './containers/Loja/Salao';
import Endereco from './containers/Endereco/Endereco';
import LojaPortifolio from './containers/LojaPortifolio/LojaPortifolio';
import Colaborador from './containers/Colaborador/colaborador';
import ColaboradorProfissional from './containers/ColaboradorProfissional/colaboradorProfissional';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfilValidar" element={<PerfilValidar />} />
        <Route path="/deslogar" element={<Deslogar />} />
        <Route path="/autenticacao/:chave" element={<Autenticacao />} />
        <Route path="/reenviaAutenticacao" element={<ReenviaAutenticacao />} />
        <Route path="/alteraSenha" element={<AlteraSenha />} />
        <Route path="/recuperaSenha/:chave" element={<RecuperaSenha />} />
        <Route path="/loja" element={<Salao />} />
        <Route path="/enderecoloja" element={<Endereco />} />
        <Route path="/PortifolioLoja" element={<LojaPortifolio />} />
        <Route path="/Colaborador" element={<Colaborador />} />
        <Route path="/ColaboradorProfissional" element={<ColaboradorProfissional />} /> 
      </Routes>
    </div>
  );
};

export default App;