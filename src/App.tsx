import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';
import ExternalRedirect from './components/ExternalRedirect';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ExternalRedirect />} />
        <Route path="/Home" element={<ExternalRedirect />} />
        <Route path="/home" element={<ExternalRedirect />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/perfil" element={<PerfilForm />} />
        <Route path="/perfilValidar" element={<PerfilValidar />} />
        <Route path="/deslogar" element={<LogoutPage />} />
        <Route path="/autenticacao/:chave" element={<Autenticacao />} />
        <Route path="/reenviaAutenticacao" element={<ReenviaAutenticacao />} />
        <Route path="/alteraSenha" element={<AlteraSenhaPage />} />
        <Route path="/recuperaSenha/:chave" element={<RecuperaSenha />} />
        <Route path="/loja" element={<ProtectedRoute><Salao /></ProtectedRoute>} />
        <Route path="/loja/" element={<ProtectedRoute><Salao /></ProtectedRoute>} />
        <Route path="/Endereco/:urlParametro" element={<ProtectedRoute><Endereco /></ProtectedRoute>} />
        <Route path="/Portifolio/:urlParametro" element={<ProtectedRoute><Portifolio /></ProtectedRoute>} />
        <Route path="/Colaborador/:urlParametro" element={<ProtectedRoute><Colaborador /></ProtectedRoute>} />
        <Route path="/ColaboradorProfissional" element={<ProtectedRoute><ColaboradorProfissional /></ProtectedRoute>} /> 
        <Route path="/Produtos/Servico" element={<ProtectedRoute><Servico /></ProtectedRoute>} /> 
        <Route path="/Agenda/:urlParametro" element={<ProtectedRoute><Agenda /></ProtectedRoute>} /> 
        <Route path="/Agendamento" element={<ProtectedRoute><Agendamento /></ProtectedRoute>} />
        <Route path="*" element={<ExternalRedirect />} />
      </Routes>
    </div>
  );
};

export default App;
