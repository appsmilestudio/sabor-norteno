import React from 'react';
import { MapPin, Clock, Phone, Mail, Instagram, Facebook, ShieldCheck } from 'lucide-react';

export const RestaurantInfo: React.FC = () => {
  return (
    <section id="info-section" className="py-16 bg-white border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black tracking-widest text-orange-600 uppercase bg-orange-100 px-3 py-1 rounded-full">
            Visítanos o Pide a Domicilio
          </span>
          <h2 className="text-3xl font-black text-stone-900 mt-2">
            Sabor Norteño Piura
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Especialistas en comida criolla, marina y parrillas con la auténtica sazón norteña.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Horario */}
          <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">Horario de Atención</h3>
            <div className="space-y-1 text-xs text-stone-600">
              <p className="font-bold text-stone-800">Lunes a Domingo:</p>
              <p>10:00 AM a 1:00 AM</p>
              <span className="inline-block mt-2 font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded text-[11px]">
                🔥 Promos Lunes a Jueves
              </span>
            </div>
          </div>

          {/* Contacto Directo */}
          <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">Pedidos & Reservas</h3>
            <div className="space-y-1.5 text-xs text-stone-600">
              <a
                href="https://wa.me/51922751087"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-stone-800 hover:text-orange-600 flex items-center gap-1.5 transition-colors"
              >
                <span>WhatsApp:</span> +51 922 751 087
              </a>
              <p className="flex items-center gap-1.5 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> sabornorteno40@gmail.com
              </p>
              <p className="text-[11px] text-stone-500">
                Atención rápida para delivery y consultas.
              </p>
            </div>
          </div>

          {/* Medios de Pago */}
          <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">Medios de Pago</h3>
            <div className="space-y-2 text-xs">
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-purple-100 text-purple-800 font-extrabold px-2 py-0.5 rounded text-[11px]">
                  YAPE
                </span>
                <span className="bg-cyan-100 text-cyan-800 font-extrabold px-2 py-0.5 rounded text-[11px]">
                  PLIN
                </span>
                <span className="bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded text-[11px]">
                  BCP
                </span>
                <span className="bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded text-[11px]">
                  BBVA
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Tarjetas Visa, Mastercard y Efectivo contra entrega.
              </p>
            </div>
          </div>

          {/* Ubicación & Redes */}
          <div className="p-6 rounded-3xl bg-orange-50/50 border border-orange-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-stone-900">Ubicación & Redes</h3>
            <div className="space-y-1.5 text-xs text-stone-600">
              <p className="font-bold text-stone-800">Piura - Perú</p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:underline"
                >
                  <Instagram className="w-3.5 h-3.5" /> @sabornorteno.piura
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
