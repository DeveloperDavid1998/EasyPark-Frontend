import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogIn, LogOut, Car, DollarSign, Users, BarChart3, Settings, CreditCard } from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/entrada', label: 'Entrada', icon: LogIn },
  { path: '/salida', label: 'Salida / Cobro', icon: DollarSign },
  { path: '/abonados', label: 'Abonados', icon: Users },
  { path: '/reportes', label: 'Reportes', icon: BarChart3 },
  { path: '/tarifas', label: 'Tarifas', icon: CreditCard },
  { path: '/usuarios', label: 'Usuarios', icon: Settings },
];

function Layout({ children, usuario, onLogout }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-emerald-400">🅿 EasyPark</h1>
          <p className="text-xs text-gray-400 mt-1">Sistema de Parqueadero</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm font-medium">{usuario?.nombre}</p>
          <p className="text-xs text-gray-400">{usuario?.rol}</p>
          <button onClick={onLogout} className="flex items-center gap-2 mt-2 text-xs text-red-400 hover:text-red-300">
            <LogOut size={14} /> Cerrar sesion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

export default Layout;