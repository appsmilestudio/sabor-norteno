import React from 'react';
import { ShoppingBag, Calendar, Flame, Clock, ArrowRight, Sparkles, MapPin, Phone } from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onOpenReservations: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onOpenReservations }) => {
  return (
    <section className="relative bg-gradient-to-b from-stone-100/90 via-orange-50/40 to-white overflow-hidden pt-8 pb-14 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          {/* Gastronomy Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 text-orange-800 border border-orange-200 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
            <span className="tracking-wide">Auténtica Tradición Piurana & Cevichera</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.08]">
            Comida Criolla, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-red-600">
              Marina & Rondas
            </span>{' '}
            Norteñas
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            El sabor tradicional de Piura en tu mesa: ceviche de filete y conchas negras, seco de chavelo, majado de yuca, jaleas marinas crocantes y rondas especiales. Pide online con delivery o reserva tu mesa.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 shadow-xs">
              <Flame className="w-3.5 h-3.5 text-orange-500" /> Promos Lunes a Jueves
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-amber-500" /> Lun - Dom: 10 AM a 1 AM
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-xl border border-stone-200 text-xs font-bold text-stone-700 shadow-xs">
              🛵 Delivery Piura & Alrededores
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOrderNow}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Menú & Pedir Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenReservations}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-stone-50 text-stone-800 font-bold text-sm rounded-2xl border border-stone-300 hover:border-orange-400 shadow-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>Reservar Mesa</span>
            </button>
          </div>
        </div>

        {/* GRAND PROMINENT BANNER SHOWCASE */}
        <div className="mt-8 lg:mt-10 max-w-5xl mx-auto">
          <div className="relative group">
            {/* Ambient Warm Backlight Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-red-400 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700"></div>

            {/* Banner Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="/BANNER.jpg"
                alt="Sabor Norteño Restaurante Banner Oficial"
                className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200';
                }}
              />

              {/* Bottom Status Bar */}
              <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[11px]">
                    Cocina y Salón Abiertos Hoy
                  </span>
                  <span className="hidden sm:inline text-stone-500">|</span>
                  <span className="hidden sm:inline text-stone-300 font-medium">
                    Restobar & Cevichería · Piura, Perú
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-amber-400 font-bold">
                    🔥 Promos Lunes a Jueves
                  </span>
                  <a
                    href="https://wa.me/51922751087?text=Hola%20Sabor%20Norteño,%20deseo%20hacer%20un%20pedido"
                    target="_blank"
                    rel="noreferrer"
                    className="font-black text-white hover:text-orange-400 flex items-center gap-1.5 transition-colors bg-white/10 px-3 py-1 rounded-xl border border-white/20"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" /> +51 922 751 087
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
