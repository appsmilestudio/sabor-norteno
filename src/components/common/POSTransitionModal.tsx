import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface POSTransitionModalProps {
  onComplete: () => void;
}

export const POSTransitionModal: React.FC<POSTransitionModalProps> = ({ onComplete }) => {
  const { isLiveDatabase } = useApp();
  const [opacity, setOpacity] = useState('opacity-100');

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setOpacity('opacity-0');
    }, 600);

    const finishTimer = setTimeout(() => {
      onComplete();
    }, 850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950/95 backdrop-blur-md text-white transition-opacity duration-300 ease-out ${opacity}`}
    >
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm">
        {/* Animated Badge & Logo */}
        <div className="relative mb-5">
          <div className="absolute -inset-3 bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 rounded-full blur-lg opacity-70 animate-pulse"></div>
          
          <div className="relative w-24 h-24 bg-white rounded-full p-2 border-2 border-orange-500 shadow-2xl flex items-center justify-center overflow-hidden animate-spin-slow">
            <img
              src="/mascot.png"
              alt="Sabor Norteño Mascot"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo_clean_no_shadow.png';
              }}
            />
          </div>

          <div className="absolute -bottom-1 -right-1 bg-orange-600 text-white p-1.5 rounded-full shadow-lg border-2 border-stone-900">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-black text-white tracking-tight mb-1">
          Accediendo a Sistema POS
        </h2>
        <p className="text-xs text-stone-400 font-medium mb-4">
          Caja, Mesas, Comandas & Control de Cocina
        </p>

        {/* Small Progress Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 rounded-full text-[11px] font-bold text-amber-400 mb-2">
          <Cpu className="w-3.5 h-3.5 animate-spin" />
          <span>Sincronizando terminal...</span>
        </div>

        {isLiveDatabase ? (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
            <Database className="w-3 h-3" /> Supabase Realtime Conectado
          </span>
        ) : (
          <span className="text-[10px] text-stone-400 font-semibold">
            Modo Local Seguro
          </span>
        )}
      </div>
    </div>
  );
};
