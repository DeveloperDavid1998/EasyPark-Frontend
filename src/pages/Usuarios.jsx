import { useEffect, useState } from 'react';
import api from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('operador');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await api.get('/auth/usuarios');
      setUsuarios(res.data.data);
    } catch (err) { console.error(err); }
  };

  const crearUsuario = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    try {
      await api.post('/auth/register', { nombre, email, password, rol });
      setMensaje('Usuario creado exitosamente');
      setNombre(''); setEmail(''); setPassword(''); setRol('operador');
      setMostrarForm(false);
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  const cambiarRol = async (id, nuevoRol) => {
    try {
      await api.put(`/auth/usuarios/${id}`, { rol: nuevoRol });
      cargarUsuarios();
    } catch (err) { console.error(err); }
  };

  const toggleActivo = async (id, estadoActual) => {
    try {
      await api.put(`/auth/usuarios/${id}`, { activo: !estadoActual });
      cargarUsuarios();
    } catch (err) { console.error(err); }
  };

  const rolColor = (rol) => {
    switch (rol) {
      case 'admin': return 'bg-red-100 text-red-700';
      case 'operador': return 'bg-blue-100 text-blue-700';
      case 'contador': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion de Usuarios</h1>
        <button onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
          {mostrarForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {mensaje && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg mb-4">{mensaje}</p>}
      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg mb-4">{error}</p>}

      {mostrarForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h2 className="font-semibold mb-4">Crear Nuevo Usuario</h2>
          <form onSubmit={crearUsuario} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre completo</label>
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Juan Perez" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="juan@easypark.com" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Contrasena</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="********" required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Rol</label>
              <select value={rol} onChange={e => setRol(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm">
                <option value="operador">Operador</option>
                <option value="contador">Contador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <button type="submit"
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Usuarios Registrados ({usuarios.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Rol</th>
                <th className="text-left p-3">Estado</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{u.nombre}</td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${rolColor(u.rol)}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <select value={u.rol} onChange={e => cambiarRol(u.id, e.target.value)}
                        className="border rounded px-2 py-1 text-xs">
                        <option value="operador">Operador</option>
                        <option value="contador">Contador</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={() => toggleActivo(u.id, u.activo)}
                        className={`px-3 py-1 rounded text-xs font-medium ${u.activo ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}>
                        {u.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;

