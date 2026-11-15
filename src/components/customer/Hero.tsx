import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Calendar,
  Flame,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  ChevronLeft,
  ChevronRight,
  Award,
  UtensilsCrossed,
  Heart
} from 'lucide-react';

interface HeroProps {
  onOrderNow: () => void;
  onOpenReservations: () => void;
}

const PROMOS = [
  {
    id: 1,
    title: 'Para tus Bajadas',
    subtitle: 'Fines de semana hasta la 1:00 AM',
    highlight: '¡Y no olvides armar tus combos!',
    image: '/promos/promo-bajadas.jpg',
    tag: 'Fines de Semana',
    tagColor: 'bg-red-600 text-white'
  },
  {
    id: 2,
    title: 'Llegó la Navidad',
    subtitle: 'Ceviches, Criollos & Celebraciones',
    highlight: 'Urb. El Trébol Mz D Lote 08, Piura',
    image: '/promos/promo-navidad.jpg',
    tag: 'Temporada Festiva',
    tagColor: 'bg-emerald-600 text-white'
  },
  {
    id: 3,
    title: 'Ven y Disfruta',
    subtitle: 'Gran Variedad de Ceviches Frescos',
    highlight: 'Delivery Directo: 974 283 249',
    image: '/promos/promo-ceviches.jpg',
    tag: 'Especial Marino',
    tagColor: 'bg-amber-500 text-stone-950 font-black'
  }
];

export const Hero: React.FC<HeroProps> = ({ onOrderNow, onOpenReservations }) => {
  const [currentPromo, setCurrentPromo] = useState(0);

  // Auto-rotate promo slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromo(prev => (prev + 1) % PROMOS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextPromo = () => setCurrentPromo(prev => (prev + 1) % PROMOS.length);
  const prevPromo = () => setCurrentPromo(prev => (prev - 1 + PROMOS.length) % PROMOS.length);

  return (
    <section className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden pt-8 pb-16">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP BRAND BADGE & HEADLINE */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-red-500/20 border border-orange-500/40 text-amber-300 text-xs font-bold shadow-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span className="tracking-wider uppercase">Restobar & Cevichería · Piura, Perú</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
            La Verdadera Sazón <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-red-400">
              Criolla & Marina
            </span>{' '}
            en tu Mesa
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            Ceviches frescos de filete y conchas negras, seco de chavelo, majado de yuca, jaleas crocantes y rondas especiales preparadas al instante con los mejores insumos de nuestra tierra piurana.
          </p>

          {/* Quick info pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/80 rounded-xl border border-stone-700 text-stone-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Urb. El Trébol Mz D Lote 08, Piura</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800/80 rounded-xl border border-stone-700 text-stone-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lun - Dom: 10:00 AM a 1:00 AM</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 rounded-xl border border-amber-500/40 text-amber-300 font-bold">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Promos Lunes a Jueves</span>
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOrderNow}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Nuestra Carta Completa</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenReservations}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-800/90 hover:bg-stone-700 text-white font-bold text-sm rounded-2xl border border-stone-700 hover:border-orange-500 shadow-md transition-all"
            >
              <Calendar className="w-4 h-4 text-orange-400" />
              <span>Reservar Mesa</span>
            </button>

            <a
              href="https://wa.me/51974283249?text=Hola%20Sabor%20Norteño,%20deseo%20hacer%20un%20pedido"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-md transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Delivery</span>
            </a>
          </div>
        </div>

        {/* PROMO SPOTLIGHT & DISHES SHOWCASE GRID */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT: PROMOTIONAL CAROUSEL (Col 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative rounded-3xl overflow-hidden bg-stone-800/80 border border-stone-700/80 shadow-2xl flex-1 flex flex-col justify-between group">
              
              {/* Carousel Image with Zoom */}
              <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden bg-stone-950">
                <img
                  src={PROMOS[currentPromo].image}
                  alt={PROMOS[currentPromo].title}
                  className="w-full h-full object-contain sm:object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>

                {/* Floating Promo Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg ${PROMOS[currentPromo].tagColor}`}>
                    {PROMOS[currentPromo].tag}
                  </span>
                </div>

                {/* Arrow Controls */}
                <button
                  onClick={prevPromo}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/20 active:scale-95"
                  aria-label="Promoción anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextPromo}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-900/80 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-sm transition-all border border-white/20 active:scale-95"
                  aria-label="Siguiente promoción"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {PROMOS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPromo(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentPromo ? 'w-7 bg-orange-500' : 'w-2 bg-white/50 hover:bg-white'
                      }`}
                      aria-label={`Ver promoción ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Details Bar */}
              <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white">
                    {PROMOS[currentPromo].title}
                  </h3>
                  <p className="text-xs text-amber-400 font-bold">
                    {PROMOS[currentPromo].subtitle} · <span className="text-stone-300">{PROMOS[currentPromo].highlight}</span>
                  </p>
                </div>

                <button
                  onClick={onOrderNow}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Pedir Promo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT: REAL DISHES SHOWCASE (Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Dish Card 1: Ronda Criolla */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-800/80 border border-stone-700/80 p-4 shadow-xl flex items-center gap-4 group hover:border-orange-500/60 transition-all">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-600 relative">
                <img
                  src="/platos/plato-ronda-criolla.jpg"
                  alt="Ronda Criolla Tradicional"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute bottom-1 right-1 bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  ★ Estrella
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>Especialidad Norteña</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                  Ronda Criolla Completa
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2 mt-0.5">
                  Majado de yuca, seco de chavelo, carne aliñada, palta fresca y chifles artesanales.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">S/ 50.00</span>
                  <button
                    onClick={onOrderNow}
                    className="text-[11px] font-bold text-orange-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Ordenar</span> &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Dish Card 2: Piqueo Norteño en Barro */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-800/80 border border-stone-700/80 p-4 shadow-xl flex items-center gap-4 group hover:border-orange-500/60 transition-all">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-600 relative">
                <img
                  src="/platos/plato-piqueo-barro.jpg"
                  alt="Piqueo en Plato de Barro"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute bottom-1 right-1 bg-amber-500 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded-md">
                  Tradicional
                </span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-1">
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span>En Plato de Barro</span>
                </div>
                <h4 className="text-base font-black text-white group-hover:text-orange-400 transition-colors">
                  Piqueo Seco de Chavelo & Majado
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2 mt-0.5">
                  Tradicional preparación piurana con plátano bellaco, carne crocante y zarza criolla.
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400">Desde S/ 35.00</span>
                  <button
                    onClick={onOrderNow}
                    className="text-[11px] font-bold text-orange-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>Ordenar</span> &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Alert Card */}
            <div className="rounded-3xl bg-gradient-to-r from-orange-600/30 via-amber-600/20 to-stone-900 border border-orange-500/30 p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                  🛵 Delivery Rápido en Piura
                </p>
                <p className="text-xs text-white font-medium">
                  Llámanos al <span className="font-black text-amber-300">974 283 249</span> o <span className="font-black text-amber-300">922 751 087</span>
                </p>
              </div>
              <a
                href="https://wa.me/51974283249?text=Hola%20Sabor%20Norteño,%20deseo%20hacer%20un%20pedido"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1 shadow-md"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Pedir</span>
              </a>
            </div>

          </div>

        </div>

        {/* GRAND PROMINENT BANNER SHOWCASE */}
        <div className="mt-8 max-w-5xl mx-auto">
          <div className="relative group">
            {/* Ambient Warm Backlight Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-700"></div>

            {/* Banner Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 bg-stone-900">
              <img
                src="/BANNER.jpg"
                alt="Sabor Norteño Restaurante Banner Oficial"
                className="w-full h-auto object-cover transform group-hover:scale-[1.01] transition-transform duration-500"
              />

              {/* Bottom Status Bar */}
              <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-white px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[11px]">
                    Salón & Cocina Abiertos
                  </span>
                  <span className="hidden sm:inline text-stone-600">|</span>
                  <span className="hidden sm:inline text-stone-300 font-medium">
                    Urb. El Trébol Mz D Lote 08 · Piura
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <span className="text-amber-400 font-bold">
                    🔥 Promos de Lunes a Jueves
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
