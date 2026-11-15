import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2, Phone, User, MessageCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationsModal: React.FC<ReservationsModalProps> = ({ isOpen, onClose }) => {
  const { createReservation } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('13:30');
  const [guests, setGuests] = useState(4);
  const [area, setArea] = useState<'salon' | 'terraza' | 'bar'>('salon');
  const [notes, setNotes] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Por favor ingresa tu nombre y número de contacto.');
      return;
    }

    createReservation({
      customerName,
      phone,
      email,
      date,
      time,
      guests,
      area,
      notes
    });

    setIsConfirmed(true);

    // Optional WhatsApp message
    const msg = `📅 *RESERVA DE MESA - SABOR NORTEÑO*\n` +
      `👤 *Nombre:* ${customerName}\n` +
      `📞 *Teléfono:* ${phone}\n` +
      `🗓️ *Fecha:* ${date}\n` +
      `⏰ *Hora:* ${time}\n` +
      `👥 *Personas:* ${guests}\n` +
      `📍 *Zona preferida:* ${area.toUpperCase()}\n` +
      (notes ? `📝 *Detalle/Ocasión:* ${notes}\n` : '');

    const waUrl = `https://wa.me/51922751087?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {isConfirmed ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                ¡Reserva Registrada!
              </span>
              <h3 className="text-2xl font-black text-stone-900 mt-1">
                Te esperamos en Sabor Norteño
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
                Hemos reservado tu espacio para el <strong>{date}</strong> a las <strong>{time}</strong> para <strong>{guests} personas</strong> en la zona <strong>{area}</strong>.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 transition-all"
            >
              Cerrar y Ver Menú
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Reserva tu Espacio
              </span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                Disfruta en Salón o Terraza
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Atención de Lunes a Domingo de 10:00 AM a 1:00 AM.
              </p>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" /> Fecha:
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-orange-600" /> Hora:
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Guests & Area */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <Users className="w-3.5 h-3.5 text-orange-600" /> Número de Personas:
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Ambiente deseado:
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none bg-white font-medium"
                >
                  <option value="salon">Salón Principal</option>
                  <option value="terraza">Terraza al Aire Libre</option>
                  <option value="bar">Zona Bar</option>
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-stone-400" /> Nombre del titular:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Valeria Morales"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" /> Teléfono / WhatsApp:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="922 751 087"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Correo (opcional):
                  </label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  ¿Es para alguna ocasión especial o tienes alguna petición?
                </label>
                <input
                  type="text"
                  placeholder="Ej. Cumpleaños, aniversario, mesa con sillón..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 mt-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirmar Reserva y Enviar WhatsApp</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
