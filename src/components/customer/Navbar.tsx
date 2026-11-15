import React from 'react';
import { ShoppingBag, Calendar, Phone, Clock, ShieldCheck, MapPin, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenReservations: () => void;
  onScrollToMenu: () => void;
  onScrollToInfo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenReservations,
  onScrollToMenu,
  onScrollToInfo
}) => {
  const { cartCount, cartTotal, setIsAdminView, setAdminSubView } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-sm transition-all">
      {/* Top announcement bar - Sleek & Professional */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Piura, Perú
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-stone-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Lun - Dom: 10:00 AM a 1:00 AM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              🔥 Promos de Lunes a Jueves
            </span>
            <a
              href="https://wa.me/51922751087?text=Hola%20Sabor%20Norteño,%20deseo%20hacer%20un%20pedido"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-stone-200 hover:text-white transition-colors text-xs font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+51 922 751 087</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo only - Clean, Professional & NO SHADOWS */}
        <div
          className="flex items-center cursor-pointer py-1 transition-transform hover:opacity-90 active:scale-95"
          onClick={onScrollToMenu}
          title="Sabor Norteño Restaurante"
        >
          <img
            src="/logo_clean_no_shadow.png"
            alt="Sabor Norteño Restaurante"
            className="h-16 sm:h-20 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/LOGO.jpg';
            }}
          />
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={onScrollToMenu}
            className="text-stone-700 hover:text-orange-600 font-bold text-sm tracking-tight transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-orange-500 after:transition-all"
          >
            Nuestra Carta
          </button>
          <button
            onClick={onOpenReservations}
            className="flex items-center gap-1.5 text-stone-700 hover:text-orange-600 font-bold text-sm tracking-tight transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-orange-500 after:transition-all"
          >
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Reservar Mesa</span>
          </button>
          <button
            onClick={onScrollToInfo}
            className="text-stone-700 hover:text-orange-600 font-bold text-sm tracking-tight transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-orange-500 after:transition-all"
          >
            Ubicación & Horarios
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Waiter Mobile Mode Direct Button */}
          <button
            onClick={() => {
              setIsAdminView(true);
              setAdminSubView('waiter');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-black text-amber-900 bg-amber-100 hover:bg-amber-200 active:scale-95 rounded-xl transition-all border border-amber-300 shadow-sm"
            title="Modo Mozo / Comandero Rápido en Teléfono"
          >
            <Smartphone className="w-4 h-4 text-amber-700" />
            <span className="font-extrabold">Mozo</span>
          </button>

          {/* Backoffice Admin Button */}
          <button
            onClick={() => {
              setIsAdminView(true);
              setAdminSubView('pos');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all border border-stone-200"
            title="Ingreso a POS, Mesas, Cocina e Inventario"
          >
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">Panel</span> POS
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold rounded-xl shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <ShoppingBag className="w-5 h-5" />
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Mi Pedido</span>
              <span className="text-sm font-black">S/ {cartTotal.toFixed(2)}</span>
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
