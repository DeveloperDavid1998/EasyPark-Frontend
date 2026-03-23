import { useState } from 'react';
import api from '../services/api';

function Entrada({ usuario }) {
  const [tipo, setTipo] = useState('carro');
  const [placa, setPlaca] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registrarEntrada = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResultado(null);
    try {
      const res = await api.post('/registros/entrada', {
        placa: placa.toUpperCase(),
        tipo,
        operador_id: usuario.id
      });
      setResultado(res.data.data);
      setPlaca('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar entrada');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Registrar Entrada</h1>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={registrarEntrada} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de vehiculo</label>
            <div className="grid grid-cols-3 gap-3">
              {['carro', 'moto', 'bicicleta'].map(t => (
                <button key={t} type="button" onClick={() => setTipo(t)}
                  className={`p-3 rounded-lg border-2 text-center font-medium capitalize transition-colors ${tipo === t ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300'}`}>
                  {t === 'carro' ? '🚗' : t === 'moto' ? '🏍' : '🚲'} {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Numero de placa</label>
            <input type="text" value={placa} onChange={e => setPlaca(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 uppercase"
              placeholder="ABC 123" required />
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50">
            {loading ? 'Registrando...' : 'Registrar Entrada'}
          </button>
        </form>
      </div>

      {resultado && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-bold text-emerald-800 text-lg mb-3">Entrada registrada</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">Tiquete:</p><p className="font-mono font-bold text-lg">{resultado.tiquete}</p>
            <p className="text-gray-600">Placa:</p><p className="font-bold">{resultado.vehiculo.placa}</p>
            <p className="text-gray-600">Tipo:</p><p className="capitalize">{resultado.vehiculo.tipo}</p>
            <p className="text-gray-600">Espacio:</p><p>{resultado.espacio.numero} - {resultado.espacio.zona}</p>
            <p className="text-gray-600">Abonado:</p><p>{resultado.es_abonado ? 'Si' : 'No'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entrada;