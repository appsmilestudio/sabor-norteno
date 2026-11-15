import React, { useEffect, useState } from 'react';
import { Sparkles, Utensils } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Start fading after 1.3s
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1300);

    // Remove from DOM after 1.8s
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-950 text-white transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-orange-600/30 via-amber-500/20 to-red-600/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Animated Logo Container */}
        <div className="relative mb-6 transform transition-all duration-700 ease-out animate-bounce">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 rounded-full blur-xl opacity-60 animate-spin"></div>
          
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 bg-white/95 rounded-full p-2.5 shadow-2xl border-4 border-amber-400/80 flex items-center justify-center overflow-hidden">
            <img
              src="/mascot.png"
              alt="Sabor Norteño Mascot"
              className="w-full h-full object-contain transform hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo_clean_no_shadow.png';
              }}
            />
          </div>
        </div>

        {/* Brand Text with Glow */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md mb-1">
          SABOR NORTEÑO
        </h1>
        
        <p className="text-amber-400 font-extrabold text-sm sm:text-base tracking-widest uppercase mb-4">
          Restobar & Cevichería · Piura
        </p>

        {/* Loading Progress Bar */}
        <div className="w-48 sm:w-64 h-1.5 bg-stone-800 rounded-full overflow-hidden border border-stone-700 mb-3">
          <div className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-red-500 rounded-full animate-[shimmer_1.5s_infinite] w-full"></div>
        </div>

        <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Cargando carta fresca y cocina tradicional...</span>
        </div>
      </div>
    </div>
  );
};
