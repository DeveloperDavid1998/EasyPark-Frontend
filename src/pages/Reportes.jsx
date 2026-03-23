import { useEffect, useState } from 'react';
import api from '../services/api';

function Reportes() {
  const [pagos, setPagos] = useState(null);

  useEffect(() => {
    api.get('/pagos/hoy').then(res => setPagos(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes del Dia</h1>
      {pagos && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-sm text-gray-500">Efectivo</p>
            <p className="text-xl font-bold text-green-600">${pagos.resumen.total_efectivo.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-sm text-gray-500">Tarjeta</p>
            <p className="text-xl font-bold text-blue-600">${pagos.resumen.total_tarjeta.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-sm text-gray-500">Digital</p>
            <p className="text-xl font-bold text-purple-600">${pagos.resumen.total_digital.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <p className="text-sm text-gray-500">Total general</p>
            <p className="text-xl font-bold">${pagos.resumen.total_general.toLocaleString()}</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b"><h2 className="font-semibold">Transacciones de hoy ({pagos?.resumen?.total_pagos || 0})</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Vehiculo</th>
                <th className="text-left p-3">Monto</th>
                <th className="text-left p-3">Metodo</th>
                <th className="text-left p-3">Hora</th>
              </tr>
            </thead>
            <tbody>
              {pagos?.data?.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3 font-bold">{p.registros?.vehiculos?.placa}</td>
                  <td className="p-3 font-medium">${Number(p.monto).toLocaleString()}</td>
                  <td className="p-3 capitalize">{p.metodo_pago}</td>
                  <td className="p-3">{new Date(p.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reportes;