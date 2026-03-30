import { useEffect, useState } from 'react';
import api from '../services/api';

function Abonados() {
  const [abonados, setAbonados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    cargarAbonados();
  }, []);

  const cargarAbonados = async () => {
    setLoading(true);
    try {
      const res = await api.get('/abonados');
      setAbonados(res.data.data);
    } catch (err) {
      console.error('Error cargando abonados:', err);
    }
    setLoading(false);
  };

  const renovarAbonado = async (id) => {
    if (!confirm('¿Renovar este abono por 1 mes mas?')) return;
    try {
      await api.post(`/abonados/${id}/renovar`);
      cargarAbonados();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al renovar');
    }
  };

  const cancelarAbonado = async (id) => {
    if (!confirm('¿Cancelar este abono? Esta accion no se puede deshacer.')) return;
    try {
      await api.delete(`/abonados/${id}`);
      cargarAbonados();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al cancelar');
    }
  };

  const abonadosFiltrados = abonados.filter(ab => {
    if (filtro === 'todos') return true;
    if (filtro === 'activos') return ab.estado === 'activo';
    if (filtro === 'vencidos') return ab.estado === 'vencido';
    if (filtro === 'cancelados') return ab.estado === 'cancelado';
    return true;
  });

  const conteo = {
    todos: abonados.length,
    activos: abonados.filter(a => a.estado === 'activo').length,
    vencidos: abonados.filter(a => a.estado === 'vencido').length,
    cancelados: abonados.filter(a => a.estado === 'cancelado').length,
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const diasRestantes = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diff = Math.ceil((fin - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Gestion de Abonados</h1>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold">{conteo.todos}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Activos</p>
          <p className="text-xl font-bold text-green-600">{conteo.activos}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Vencidos</p>
          <p className="text-xl font-bold text-orange-600">{conteo.vencidos}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Cancelados</p>
          <p className="text-xl font-bold text-red-600">{conteo.cancelados}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {['todos', 'activos', 'vencidos', 'cancelados'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-lg font-medium text-sm capitalize ${filtro === f ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {f} ({conteo[f]})
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Cargando...</p>}

      {/* Tabla de abonados */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Abonados ({abonadosFiltrados.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Nombre</th>
                  <th className="text-left p-3">Telefono</th>
                  <th className="text-left p-3">Placa</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Fecha Inicio</th>
                  <th className="text-left p-3">Fecha Vencimiento</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-center p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {abonadosFiltrados.length === 0 && (
                  <tr><td colSpan="8" className="p-6 text-center text-gray-400">No hay abonados registrados</td></tr>
                )}
                {abonadosFiltrados.map(ab => (
                  ab.vehiculos.map((veh, idx) => (
                    <tr key={`${ab.id}-${idx}`} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{ab.nombre}</td>
                      <td className="p-3">{ab.telefono}</td>
                      <td className="p-3 font-bold">{veh.placa}</td>
                      <td className="p-3 capitalize">{veh.tipo}</td>
                      <td className="p-3">{formatFecha(veh.fecha_inicio)}</td>
                      <td className="p-3">
                        <span className={veh.activo && diasRestantes(veh.fecha_fin) <= 5 ? 'text-orange-600 font-medium' : ''}>
                          {formatFecha(veh.fecha_fin)}
                        </span>
                        {veh.activo && diasRestantes(veh.fecha_fin) <= 5 && diasRestantes(veh.fecha_fin) > 0 && (
                          <span className="ml-1 text-xs text-orange-500">({diasRestantes(veh.fecha_fin)}d)</span>
                        )}
                      </td>
                      <td className="p-3">
                        {veh.activo ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Activo</span>
                        ) : ab.estado === 'cancelado' ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Cancelado</span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Vencido</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex gap-1 justify-center">
                          {(ab.estado === 'vencido' || !veh.activo) && ab.estado !== 'cancelado' && (
                            <button onClick={() => renovarAbonado(ab.id)}
                              className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200">
                              Renovar
                            </button>
                          )}
                          {ab.estado !== 'cancelado' && (
                            <button onClick={() => cancelarAbonado(ab.id)}
                              className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200">
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Abonados;