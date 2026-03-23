import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Entrada from './pages/Entrada';
import Salida from './pages/Salida';
import Abonados from './pages/Abonados';
import Reportes from './pages/Reportes';
import Tarifas from './pages/Tarifas';
import Usuarios from './pages/Usuarios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario') || 'null'));

  const login = (token, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setToken(token);
    setUsuario(usuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  };

  if (!token) return <Login onLogin={login} />;

  return (
    <BrowserRouter>
      <Layout usuario={usuario} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/entrada" element={<Entrada usuario={usuario} />} />
          <Route path="/salida" element={<Salida usuario={usuario} />} />
          <Route path="/abonados" element={<Abonados />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/tarifas" element={<Tarifas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;