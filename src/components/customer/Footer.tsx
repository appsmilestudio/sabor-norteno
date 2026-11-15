import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setIsAdminView } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 bg-white p-0.5">
              <img
                src="/LOGO.jpg"
                alt="Sabor Norteño"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="text-base font-black text-white tracking-wide">
                SABOR NORTEÑO RESTOBAR
              </h4>
              <p className="text-xs text-stone-400">
                Cevichería, Comida Criolla & Parrillas · Piura, Perú
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold">
            <a
              href="https://wa.me/51922751087"
              target="_blank"
              rel="noreferrer"
              className="hover:text-orange-400 transition-colors"
            >
              WhatsApp: +51 922 751 087
            </a>
            <button
              onClick={() => setIsAdminView(true)}
              className="text-orange-400 hover:text-orange-300 transition-colors underline"
            >
              Acceso Sistema Restaurante / POS
            </button>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Sabor Norteño. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para la gastronomía piurana
          </p>
        </div>
      </div>
    </footer>
  );
};
