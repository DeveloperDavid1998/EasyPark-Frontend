import { useEffect, useState } from 'react';
import api from '../services/api';

function Tarifas() {
  const [tarifas, setTarifas] = useState([]);

  useEffect(() => {
    api.get('/tarifas').then(res => setTarifas(res.data.data)).catch(console.error);
  }, []);

  const actualizarTarifa = async (id, valor) => {
    try {
      await api.put(`/tarifas/${id}`, { valor: parseFloat(valor) });
      api.get('/tarifas').then(res => setTarifas(res.data.data));
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuracion de Tarifas</h1>
      <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Tipo vehiculo</th>
              <th className="text-left p-3">Tipo tarifa</th>
              <th className="text-left p-3">Valor</th>
              <th className="text-left p-3">Accion</th>
            </tr>
          </thead>
          <tbody>
            {tarifas.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-3 capitalize font-medium">{t.tipo_vehiculo}</td>
                <td className="p-3 capitalize">{t.tipo_tarifa}</td>
                <td className="p-3">
                  <input type="number" defaultValue={t.valor} id={`tarifa-${t.id}`}
                    className="w-32 px-3 py-1 border rounded-lg" />
                </td>
                <td className="p-3">
                  <button onClick={() => actualizarTarifa(t.id, document.getElementById(`tarifa-${t.id}`).value)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700">Guardar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tarifas;