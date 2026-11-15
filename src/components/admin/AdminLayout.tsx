import React from 'react';
import {
  Smartphone,
  LayoutDashboard,
  UtensilsCrossed,
  ChefHat,
  ShoppingBag,
  Boxes,
  CalendarCheck,
  TrendingUp,
  LogOut,
  Bell,
  Clock,
  Sparkles,
  Database
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    adminSubView,
    setAdminSubView,
    setIsAdminView,
    isLiveDatabase,
    orders,
    tables,
    reservations,
    inventory,
    playNotificationSound
  } = useApp();

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const occupiedTablesCount = tables.filter(t => t.status === 'occupied').length;
  const lowStockCount = inventory.filter(i => i.stock <= i.minStock).length;

  const navItems = [
    { id: 'waiter', label: '📱 Comandero Mozo', icon: Smartphone, badge: 'Móvil' },
    { id: 'pos', label: 'Punto de Venta (POS)', icon: LayoutDashboard },
    { id: 'tables', label: 'Mesas & Salón', icon: UtensilsCrossed, badge: occupiedTablesCount > 0 ? `${occupiedTablesCount} ocupadas` : undefined },
    { id: 'kitchen', label: 'Monitor Cocina (KDS)', icon: ChefHat, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} pend.` : undefined, badgeColor: 'bg-red-500' },
    { id: 'online_orders', label: 'Pedidos Delivery', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount}` : undefined },
    { id: 'inventory', label: 'Inventario & Stock', icon: Boxes, badge: lowStockCount > 0 ? `! ${lowStockCount}` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'reservations', label: 'Reservas', icon: CalendarCheck, badge: `${reservations.length}` },
    { id: 'reports', label: 'Cierre & Reportes', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-200 flex flex-col justify-between border-r border-stone-800 shadow-xl shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-orange-500 overflow-hidden">
                <img
                  src="/LOGO.jpg"
                  alt="Sabor Norteño"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-sm font-black text-white leading-tight">
                  SABOR NORTEÑO
                </h2>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Sistema de Gestión
                </span>
              </div>
            </div>

            <button
              onClick={playNotificationSound}
              title="Probar sonido de comanda"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-orange-400 transition-colors"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminSubView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminSubView(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.badgeColor || (isActive ? 'bg-white text-orange-700' : 'bg-stone-800 text-stone-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer / Switch back to Client Web */}
        <div className="p-3 border-t border-stone-800 space-y-2">
          <button
            onClick={() => setIsAdminView(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4 text-orange-400" />
            <span>Ver Web del Cliente</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black text-stone-900 capitalize">
              {navItems.find(i => i.id === adminSubView)?.label}
            </h1>
            {isLiveDatabase ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Database className="w-3 h-3 text-emerald-700" />
                Supabase Conectado (En Vivo)
              </span>
            ) : (
              <span
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-300"
                title="Modo local con respaldo en navegador. Conecta Supabase para sincronización multi-dispositivo en tiempo real."
              >
                <Database className="w-3 h-3 text-stone-500" />
                Modo Local (Offline)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-stone-500">
            <span className="hidden sm:inline">Restobar & Cevichería · Piura</span>
            <div className="bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-bold">
              👤 Administrador
            </div>
          </div>
        </header>

        {/* View container */}
        <div className="flex-1 p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
