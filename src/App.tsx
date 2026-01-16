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
import Portifolio from './containers/Portifolio/Portifolio';
import Colaborador from './containers/Colaborador/colaborador';
import Servico from './containers/Produtos/servico';
import ColaboradorProfissional from './containers/ColaboradorProfissional/colaboradorProfissional';
import Agenda from  './containers/Agenda/Agenda';
import Agendamento from './containers/Agendamento/Agendamento';

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
        <Route path="/Endereco/:urlParametro" element={<Endereco />} />
        <Route path="/Portifolio/:urlParametro" element={<Portifolio />} />
        <Route path="/Colaborador/:urlParametro" element={<Colaborador />} />
        <Route path="/ColaboradorProfissional" element={<ColaboradorProfissional />} /> 
        <Route path="/Produtos/Servico" element={<Servico />} /> 
        <Route path="/Agenda/:urlParametro" element={<Agenda />} /> 
        <Route path="/Agendamento" element={<Agendamento />} />
      </Routes>
    </div>
  );
};

export default App;