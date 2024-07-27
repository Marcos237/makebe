import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './containers/Home/home';
import Login from './containers/Login/login';
import Perfil from './containers/Perfil/Perfil';
import PerfilValidar from './containers/Perfil/PerfiValidar';
import Deslogar from './containers/Login/deslogar';
import Autenticacao from './containers/Perfil/Autenticacao'
import ReenviaAutenticacao from './containers/Perfil/ReenviaAutenticacao';

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/perfilValidar" element={<PerfilValidar />} />
        <Route path="/deslogar" element={<Deslogar />} />
        <Route path="/autenticacao/:chave" element={<Autenticacao />} />
        <Route path="/reenviaAutenticacao" element={<ReenviaAutenticacao />} />
      </Routes>
    </div>
  );
};

export default App;