import { useState } from 'react';
import api from '../services/api';

function Entrada({ usuario }) {
  const [tipo, setTipo] = useState('carro');
  const [placa, setPlaca] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado para modal de abonado
  const [mostrarModalAbonado, setMostrarModalAbonado] = useState(false);
  const [abonadoNombre, setAbonadoNombre] = useState('');
  const [abonadoTelefono, setAbonadoTelefono] = useState('');
  const [abonadoPlaca, setAbonadoPlaca] = useState('');
  const [abonadoTipo, setAbonadoTipo] = useState('carro');
  const [abonadoLoading, setAbonadoLoading] = useState(false);
  const [abonadoExito, setAbonadoExito] = useState(null);
  const [abonadoError, setAbonadoError] = useState('');

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

  const abrirModalAbonado = () => {
    setAbonadoPlaca('');
    setAbonadoTipo('carro');
    setAbonadoNombre('');
    setAbonadoTelefono('');
    setAbonadoExito(null);
    setAbonadoError('');
    setMostrarModalAbonado(true);
  };

  const registrarAbonado = async (e) => {
    e.preventDefault();
    setAbonadoLoading(true);
    setAbonadoError('');
    setAbonadoExito(null);
    try {
      const res = await api.post('/abonados', {
        nombre: abonadoNombre,
        telefono: abonadoTelefono,
        placa: abonadoPlaca.toUpperCase(),
        tipo: abonadoTipo
      });
      setAbonadoExito(res.data.data);
    } catch (err) {
      setAbonadoError(err.response?.data?.message || 'Error al registrar abonado');
    }
    setAbonadoLoading(false);
  };

  const formatFechaHora = (fecha) => {
    const d = new Date(fecha);
    return d.toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
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

        {/* Boton para registrar abonado */}
        <div className="mt-4 pt-4 border-t">
          <button onClick={abrirModalAbonado}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
            ⭐ Registrar Abonado
          </button>
        </div>
      </div>

      {/* Resultado de entrada */}
      {resultado && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-6">
          <h3 className="font-bold text-emerald-800 text-lg mb-3">Entrada Registrada</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600">Tiquete:</p>
            <p className="font-mono font-bold text-lg">{resultado.tiquete}</p>
            <p className="text-gray-600">Placa:</p>
            <p className="font-bold">{resultado.vehiculo.placa}</p>
            <p className="text-gray-600">Tipo:</p>
            <p className="capitalize">{resultado.vehiculo.tipo}</p>
            <p className="text-gray-600">Espacio:</p>
            <p>{resultado.espacio.numero} - {resultado.espacio.zona}</p>
            <p className="text-gray-600">Hora de ingreso:</p>
            <p className="font-medium">{formatFechaHora(resultado.entrada)}</p>
          </div>

          {resultado.es_abonado ? (
            <div className="mt-3 bg-blue-100 border border-blue-300 rounded-lg p-3">
              <p className="text-blue-800 font-bold text-center">CLIENTE ABONADO</p>
              <p className="text-blue-700 text-sm text-center">Sin cobro al momento de la salida</p>
            </div>
          ) : (
            <div className="mt-3 bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-gray-700 mb-1">Tarifas aplicables:</p>
              <div className="flex gap-4 text-sm">
                {resultado.tarifas?.fraccion && (
                  <p>Por hora: <span className="font-bold">${resultado.tarifas.fraccion.toLocaleString()}</span></p>
                )}
                {resultado.tarifas?.plena && (
                  <p>Dia completo: <span className="font-bold">${resultado.tarifas.plena.toLocaleString()}</span></p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para registrar abonado */}
      {mostrarModalAbonado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">⭐ Registrar Abonado</h3>
              <button onClick={() => setMostrarModalAbonado(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {!abonadoExito ? (
              <form onSubmit={registrarAbonado} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente</label>
                  <input type="text" value={abonadoNombre} onChange={e => setAbonadoNombre(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre completo" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
                  <input type="text" value={abonadoTelefono} onChange={e => setAbonadoTelefono(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="300 123 4567" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa del vehiculo</label>
                  <input type="text" value={abonadoPlaca} onChange={e => setAbonadoPlaca(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 uppercase"
                    placeholder="ABC 123" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de vehiculo</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['carro', 'moto', 'bicicleta'].map(t => (
                      <button key={t} type="button" onClick={() => setAbonadoTipo(t)}
                        className={`p-2 rounded-lg border-2 text-center text-sm font-medium capitalize ${abonadoTipo === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}>
                        {t === 'carro' ? '🚗' : t === 'moto' ? '🏍' : '🚲'} {t}
                      </button>
                    ))}
                  </div>
                </div>

                {abonadoError && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{abonadoError}</p>}

                <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium">La mensualidad sera de 1 mes a partir de hoy.</p>
                </div>

                <button type="submit" disabled={abonadoLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                  {abonadoLoading ? 'Registrando...' : 'Confirmar Registro de Abonado'}
                </button>
              </form>
            ) : (
              <div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
                  <p className="text-emerald-800 font-bold text-center text-lg mb-3">Abonado Registrado</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-600">Nombre:</p>
                    <p className="font-bold">{abonadoExito.nombre}</p>
                    <p className="text-gray-600">Telefono:</p>
                    <p>{abonadoExito.telefono}</p>
                    <p className="text-gray-600">Placa:</p>
                    <p className="font-bold">{abonadoExito.placa}</p>
                    <p className="text-gray-600">Tipo:</p>
                    <p className="capitalize">{abonadoExito.tipo}</p>
                    <p className="text-gray-600">Inicio:</p>
                    <p className="font-medium">{new Date(abonadoExito.fecha_inicio).toLocaleDateString('es-CO')}</p>
                    <p className="text-gray-600">Vencimiento:</p>
                    <p className="font-medium text-red-600">{new Date(abonadoExito.fecha_fin).toLocaleDateString('es-CO')}</p>
                  </div>
                </div>
                <button onClick={() => setMostrarModalAbonado(false)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200">
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Entrada;