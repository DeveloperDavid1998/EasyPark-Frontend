import { useEffect, useState } from 'react';
import api from '../services/api';
import { Car, Bike, ParkingCircle, DollarSign } from 'lucide-react';

function Dashboard() {
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [activos, setActivos] = useState([]);
  const [pagosHoy, setPagosHoy] = useState(null);

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      const [dispRes, actRes, pagRes] = await Promise.all([
        api.get('/espacios/disponibilidad'),
        api.get('/registros/activos'),
        api.get('/pagos/hoy')
      ]);
      setDisponibilidad(dispRes.data);
      setActivos(actRes.data.data);
      setPagosHoy(pagRes.data.resumen);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const formatFechaHora = (fecha) => {
    const d = new Date(fecha);
    const dia = d.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const hora = d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    return `${dia} - ${hora}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><ParkingCircle className="text-blue-600" size={24} /></div>
            <div>
              <p className="text-2xl font-bold">{disponibilidad?.total || 0}</p>
              <p className="text-sm text-gray-500">Total espacios</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg"><Car className="text-red-600" size={24} /></div>
            <div>
              <p className="text-2xl font-bold">{disponibilidad?.ocupados || 0}</p>
              <p className="text-sm text-gray-500">Ocupados</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg"><ParkingCircle className="text-emerald-600" size={24} /></div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{disponibilidad?.libres || 0}</p>
              <p className="text-sm text-gray-500">Libres</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg"><DollarSign className="text-amber-600" size={24} /></div>
            <div>
              <p className="text-2xl font-bold">${pagosHoy?.total_general?.toLocaleString() || 0}</p>
              <p className="text-sm text-gray-500">Ingresos hoy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Vehiculos estacionados ({activos.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Tiquete</th>
                <th className="text-left p-3">Placa</th>
                <th className="text-left p-3">Tipo</th>
                <th className="text-left p-3">Espacio</th>
                <th className="text-left p-3">Fecha - Hora - Ingreso</th>
                <th className="text-left p-3">Tiempo</th>
              </tr>
            </thead>
            <tbody>
              {activos.map(r => (
                <tr key={r.registro_id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono font-medium">{r.tiquete}</td>
                  <td className="p-3 font-bold">{r.placa}</td>
                  <td className="p-3 capitalize">{r.tipo}</td>
                  <td className="p-3">{r.espacio} - {r.zona}</td>
                  <td className="p-3 text-gray-700">{formatFechaHora(r.entrada)}</td>
                  <td className="p-3 font-medium">{r.tiempo}</td>
                </tr>
              ))}
              {activos.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-400">No hay vehiculos estacionados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;