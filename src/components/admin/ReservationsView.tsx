import React, { useState } from 'react';
import { CalendarCheck, Users, Clock, Phone, Plus, Check, X, MessageSquare, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReservationsView: React.FC = () => {
  const { reservations, updateReservationStatus, createReservation } = useApp();
  const [isAddModal, setIsAddModal] = useState(false);

  // New reservation form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [guests, setGuests] = useState(4);
  const [area, setArea] = useState<'salon' | 'terraza' | 'bar'>('salon');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    createReservation({
      customerName: name,
      phone,
      date,
      time,
      guests,
      area,
      notes
    });
    setName('');
    setPhone('');
    setNotes('');
    setIsAddModal(false);
  };

  const handleWhatsApp = (res: any) => {
    const cleanPhone = res.phone.replace(/[^0-9]/g, '');
    const num = cleanPhone.startsWith('51') ? cleanPhone : `51${cleanPhone}`;
    const msg = `Hola *${res.customerName}*, te escribimos de *Sabor Norteño Restaurante* para confirmar tu reserva para este *${res.date}* a las *${res.time}* (${res.guests} personas en ${res.area.toUpperCase()}). ¡Los esperamos con la mejor sazón piurana!`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-base font-black text-stone-900">
            Libro de Reservas de Mesas
          </h2>
          <p className="text-xs text-stone-500">
            Gestiona reservas para almuerzos familiares, celebraciones y eventos en Piura.
          </p>
        </div>

        <button
          onClick={() => setIsAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Reserva Manual</span>
        </button>
      </div>

      {/* Reservations List */}
      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <CalendarCheck className="w-16 h-16 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">No hay reservas registradas</h3>
          <p className="text-xs text-stone-400 mt-1">Las reservas que hagan los clientes en la web se listarán aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map(res => (
            <div
              key={res.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <CalendarCheck className="w-4 h-4 text-orange-600" /> {res.date}
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      res.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : res.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {res.status === 'confirmed' ? 'Confirmada' : res.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs">
                  <h4 className="text-sm font-extrabold text-stone-900">
                    {res.customerName}
                  </h4>
                  <p className="text-stone-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-600" /> {res.phone}
                  </p>
                  <div className="flex items-center gap-4 text-stone-700 font-semibold pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> {res.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" /> {res.guests} personas
                    </span>
                    <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded capitalize text-[11px]">
                      {res.area}
                    </span>
                  </div>

                  {res.notes && (
                    <p className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-xl border border-stone-100 mt-2">
                      "{res.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleWhatsApp(res)}
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <div className="flex gap-1">
                  {res.status !== 'confirmed' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'confirmed')}
                      className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                      title="Marcar confirmada"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {res.status !== 'cancelled' && (
                    <button
                      onClick={() => updateReservationStatus(res.id, 'cancelled')}
                      className="p-2 bg-stone-100 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                      title="Cancelar reserva"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Add Reservation Modal */}
      {isAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-black text-stone-900">
                Registrar Nueva Reserva
              </h3>
              <button
                onClick={() => setIsAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nombre del Cliente:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Farfán"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Teléfono:</label>
                <input
                  type="tel"
                  required
                  placeholder="922 751 087"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Fecha:</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Hora:</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Personas:</label>
                  <input
                    type="number"
                    min={1}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Ambiente:</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="salon">Salón</option>
                    <option value="terraza">Terraza</option>
                    <option value="bar">Bar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Notas / Motivo:</label>
                <input
                  type="text"
                  placeholder="Ej. Aniversario, mesa al centro..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl"
                >
                  Guardar Reserva
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModal(false)}
                  className="px-4 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
