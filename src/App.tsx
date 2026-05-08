import React from 'react';
import { Routes, Route , Navigate} from 'react-router-dom';
import Home from './features/home';
import { AlteraSenhaPage, LoginForm, LogoutPage } from './features/login';
import { Autenticacao, PerfilForm, PerfilValidar, RecuperaSenha, ReenviaAutenticacao } from './features/perfil';
import Salao from './features/loja';
import Endereco from './features/endereco';
import Portifolio from './features/portifolio';
import Colaborador from './features/colaborador';
import Servico from './features/produtos';
import ColaboradorProfissional from './features/colaborador-profissional';
import Agenda from './features/agenda';
import Agendamento from './features/agendamento';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/perfil" element={<PerfilForm />} />
        <Route path="/perfilValidar" element={<PerfilValidar />} />
        <Route path="/deslogar" element={<LogoutPage />} />
        <Route path="/autenticacao/:chave" element={<Autenticacao />} />
        <Route path="/reenviaAutenticacao" element={<ReenviaAutenticacao />} />
        <Route path="/alteraSenha" element={<AlteraSenhaPage />} />
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
