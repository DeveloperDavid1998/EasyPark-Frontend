import { useEffect, useState } from 'react';
import api from '../services/api';

function Reportes() {
  const [pagos, setPagos] = useState(null);
  const [vista, setVista] = useState('hoy');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [diaDetalle, setDiaDetalle] = useState(null);

  useEffect(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const mes = hoy.substring(0, 7);
    setFechaDesde(hoy);
    setFechaHasta(hoy);
    setMesSeleccionado(mes);
    cargarHoy();
  }, []);

  const cargarHoy = async () => {
    setLoading(true);
    setDiaDetalle(null);
    try {
      const res = await api.get('/pagos/hoy');
      setPagos({ ...res.data, resumen_diario: null });
      setVista('hoy');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const cargarPorFechas = async () => {
    if (!fechaDesde || !fechaHasta) return;
    setLoading(true);
    setDiaDetalle(null);
    try {
      const res = await api.get(`/pagos/fecha?desde=${fechaDesde}&hasta=${fechaHasta}`);
      setPagos(res.data);
      setVista('rango');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const cargarMes = async () => {
    if (!mesSeleccionado) return;
    setLoading(true);
    setDiaDetalle(null);
    const [anio, mes] = mesSeleccionado.split('-');
    const desde = `${mesSeleccionado}-01`;
    const ultimoDia = new Date(anio, mes, 0).getDate();
    const hasta = `${mesSeleccionado}-${ultimoDia}`;
    try {
      const res = await api.get(`/pagos/fecha?desde=${desde}&hasta=${hasta}`);
      setPagos(res.data);
      setVista('mes');
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const verDetalleDia = (fecha) => {
    if (diaDetalle === fecha) {
      setDiaDetalle(null);
    } else {
      setDiaDetalle(fecha);
    }
  };

  const transaccionesDia = diaDetalle
    ? pagos?.data?.filter(p => new Date(p.created_at).toISOString().split('T')[0] === diaDetalle)
    : pagos?.data;

  const formatFecha = (fecha) => {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const d = new Date(fecha + 'T12:00:00');
    return `${dias[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reportes del Parqueadero</h1>

      {/* Selector de vista */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={cargarHoy}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${vista === 'hoy' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Hoy
          </button>
          <button onClick={() => setVista('rango')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${vista === 'rango' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Por Fechas
          </button>
          <button onClick={() => setVista('mes')}
            className={`px-4 py-2 rounded-lg font-medium text-sm ${vista === 'mes' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Por Mes
          </button>
        </div>

        {vista === 'rango' && (
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Desde</label>
              <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hasta</label>
              <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <button onClick={cargarPorFechas}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Consultar
            </button>
          </div>
        )}

        {vista === 'mes' && (
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Mes</label>
              <input type="month" value={mesSeleccionado} onChange={e => setMesSeleccionado(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <button onClick={cargarMes}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Consultar
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-center text-gray-500 py-4">Cargando...</p>}

      {/* Resumen general */}
      {pagos && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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

      {/* Resumen diario (solo en vista rango o mes) */}
      {pagos?.resumen_diario && pagos.resumen_diario.length > 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Resumen por Dia ({pagos.resumen_diario.length} dias con ingresos)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-right p-3">Transacciones</th>
                  <th className="text-right p-3">Efectivo</th>
                  <th className="text-right p-3">Tarjeta</th>
                  <th className="text-right p-3">Digital</th>
                  <th className="text-right p-3">Total</th>
                  <th className="text-center p-3">Detalle</th>
                </tr>
              </thead>
              <tbody>
                {pagos.resumen_diario.map(dia => (
                  <tr key={dia.fecha} className={`border-t ${diaDetalle === dia.fecha ? 'bg-emerald-50' : 'hover:bg-gray-50'}`}>
                    <td className="p-3 font-medium">{formatFecha(dia.fecha)}</td>
                    <td className="p-3 text-right">{dia.cantidad}</td>
                    <td className="p-3 text-right text-green-600">${dia.efectivo.toLocaleString()}</td>
                    <td className="p-3 text-right text-blue-600">${dia.tarjeta.toLocaleString()}</td>
                    <td className="p-3 text-right text-purple-600">${dia.digital.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold">${dia.total.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <button onClick={() => verDetalleDia(dia.fecha)}
                        className={`px-3 py-1 rounded text-xs font-medium ${diaDetalle === dia.fecha ? 'bg-emerald-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                        {diaDetalle === dia.fecha ? 'Ocultar' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transacciones detalladas */}
      {pagos && !loading && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">
              {diaDetalle
                ? `Transacciones del ${formatFecha(diaDetalle)} (${transaccionesDia?.length || 0})`
                : `Transacciones (${pagos?.resumen?.total_pagos || 0})`
              }
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Vehiculo</th>
                  <th className="text-left p-3">Monto</th>
                  <th className="text-left p-3">Metodo</th>
                  <th className="text-left p-3">Fecha/Hora Ingreso</th>
                  <th className="text-left p-3">Fecha/Hora Salida</th>
                </tr>
              </thead>
              <tbody>
                {transaccionesDia?.length === 0 && (
                  <tr><td colSpan="6" className="p-6 text-center text-gray-400">No hay transacciones en este periodo</td></tr>
                )}
                {transaccionesDia?.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{p.id}</td>
                    <td className="p-3 font-bold">{p.registros?.vehiculos?.placa}</td>
                    <td className="p-3 font-medium">${Number(p.monto).toLocaleString()}</td>
                    <td className="p-3 capitalize">{p.metodo_pago}</td>
                    <td className="p-3">
                      {p.registros?.fecha_entrada
                        ? new Date(p.registros.fecha_entrada).toLocaleString()
                        : '—'}
                    </td>
                    <td className="p-3">
                      {p.registros?.fecha_salida
                        ? new Date(p.registros.fecha_salida).toLocaleString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reportes;
