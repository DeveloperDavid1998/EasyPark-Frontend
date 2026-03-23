import { useState } from 'react';
import api from '../services/api';

function Salida({ usuario }) {
  const [codigo, setCodigo] = useState('');
  const [resumen, setResumen] = useState(null);
  const [metodo, setMetodo] = useState('efectivo');
  const [referencia, setReferencia] = useState('');
  const [recibo, setRecibo] = useState(null);
  const [error, setError] = useState('');

  const buscarTiquete = async (e) => {
    e.preventDefault();
    setError('');
    setResumen(null);
    setRecibo(null);
    try {
      const res = await api.post('/registros/salida', {
        tiquete_codigo: codigo.toUpperCase(),
        operador_id: usuario.id
      });
      setResumen(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Tiquete no encontrado');
    }
  };

  const procesarPago = async () => {
    try {
      const res = await api.post('/pagos', {
        registro_id: resumen.registro_id,
        tarifa_id: resumen.tarifa_aplicada?.id || 1,
        monto: resumen.monto,
        metodo_pago: metodo,
        referencia: referencia || null,
        operador_id: usuario.id
      });
      setRecibo(res.data.data);
      setResumen(null);
      setCodigo('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar pago');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Salida y Cobro</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">
        <form onSubmit={buscarTiquete} className="flex gap-3">
          <input type="text" value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg uppercase"
            placeholder="Codigo del tiquete (EPK-XXXX)" required />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Buscar</button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 bg-red-50 p-2 rounded">{error}</p>}
      </div>

      {resumen && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-4">
          <h3 className="font-bold mb-4">Resumen de cobro</h3>
          <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Placa:</p><p className="font-bold">{resumen.vehiculo.placa}</p>
            <p className="text-gray-600">Tipo:</p><p className="capitalize">{resumen.vehiculo.tipo}</p>
            <p className="text-gray-600">Tiempo:</p><p className="font-medium">{resumen.tiempo}</p>
            <p className="text-gray-600">Tarifa:</p><p>${resumen.tarifa_aplicada?.valor?.toLocaleString()}/h</p>
            <p className="text-gray-600">Total:</p><p className="text-2xl font-bold text-emerald-600">${resumen.monto.toLocaleString()}</p>
          </div>
          {resumen.es_abonado && <p className="text-emerald-600 font-medium bg-emerald-50 p-3 rounded-lg mb-4">Abonado vigente - Sin cobro</p>}

          {!resumen.es_abonado && (
            <div className="space-y-3">
              <label className="block text-sm font-medium">Metodo de pago</label>
              <div className="grid grid-cols-4 gap-2">
                {['efectivo', 'tarjeta', 'nequi', 'daviplata'].map(m => (
                  <button key={m} onClick={() => setMetodo(m)}
                    className={`p-2 rounded-lg border-2 text-sm capitalize ${metodo === m ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
                    {m}
                  </button>
                ))}
              </div>
              {metodo !== 'efectivo' && (
                <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" placeholder="Referencia o aprobacion" />
              )}
            </div>
          )}
          <button onClick={procesarPago}
            className="w-full mt-4 bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700">
            {resumen.es_abonado ? 'Registrar salida' : 'Confirmar pago y abrir talanquera'}
          </button>
        </div>
      )}

      {recibo && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-bold text-emerald-800 text-lg mb-3">Pago procesado</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">Vehiculo:</p><p className="font-bold">{recibo.vehiculo}</p>
            <p className="text-gray-600">Monto:</p><p className="font-bold">${Number(recibo.monto).toLocaleString()}</p>
            <p className="text-gray-600">Metodo:</p><p className="capitalize">{recibo.metodo}</p>
            <p className="text-gray-600">Espacio liberado:</p><p>{recibo.espacio_liberado}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Salida;