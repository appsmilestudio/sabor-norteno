import React, { useState } from 'react';
import { UtensilsCrossed, Users, Clock, Plus, CheckCircle, Receipt, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RestaurantTable, TableStatus } from '../../types';

export const TablesView: React.FC = () => {
  const { tables, updateTableStatus, closeTableAccount, menu, addItemsToTable } = useApp();
  
  const [selectedArea, setSelectedArea] = useState<'all' | 'salon' | 'terraza' | 'bar'>('all');
  const [activeTableModal, setActiveTableModal] = useState<RestaurantTable | null>(null);
  
  // Quick dish add for open table modal
  const [selectedDishId, setSelectedDishId] = useState<string>('');
  const [addQty, setAddQty] = useState<number>(1);

  const filteredTables = tables.filter(t => selectedArea === 'all' || t.area === selectedArea);

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case 'free':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-800',
          badge: 'bg-emerald-500 text-white',
          label: 'Libre'
        };
      case 'occupied':
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-800',
          badge: 'bg-rose-500 text-white',
          label: 'Ocupada'
        };
      case 'bill_requested':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-800',
          badge: 'bg-amber-500 text-white animate-pulse',
          label: 'Pidió Cuenta'
        };
      case 'reserved':
        return {
          bg: 'bg-sky-50 border-sky-300 text-sky-800',
          badge: 'bg-sky-500 text-white',
          label: 'Reservada'
        };
    }
  };

  const handleAddDishToCurrentTable = () => {
    if (!activeTableModal || !selectedDishId) return;
    const dish = menu.find(m => m.id === selectedDishId);
    if (!dish) return;

    addItemsToTable(activeTableModal.id, [
      {
        cartItemId: `table-add-${Date.now()}`,
        menuItem: dish,
        quantity: addQty,
        unitPrice: dish.price,
        totalPrice: dish.price * addQty
      }
    ], activeTableModal.waiter || 'Mozo 1');

    setSelectedDishId('');
    setAddQty(1);
    setActiveTableModal(null);
  };

  const handleCloseAndFreeTable = (tableId: number) => {
    closeTableAccount(tableId);
    setActiveTableModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-base font-black text-stone-900">
            Plano y Distribución de Mesas
          </h2>
          <p className="text-xs text-stone-500">
            Supervisa el estado del salón, comensales y cuentas en tiempo real.
          </p>
        </div>

        {/* Area filters */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'salon', label: 'Salón Principal' },
            { id: 'terraza', label: 'Terraza' },
            { id: 'bar', label: 'Zona Bar' }
          ].map(area => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedArea === area.id
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filteredTables.map(table => {
          const statusInfo = getStatusColor(table.status);

          return (
            <div
              key={table.id}
              className={`rounded-3xl p-4 border-2 transition-all shadow-sm flex flex-col justify-between ${statusInfo.bg}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${statusInfo.badge}`}>
                    {statusInfo.label}
                  </span>
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {table.capacity}p
                  </span>
                </div>

                <div className="py-2 text-center">
                  <span className="text-xs font-bold uppercase text-stone-400 block tracking-wider">
                    {table.area}
                  </span>
                  <h3 className="text-2xl font-black text-stone-900 mt-0.5">
                    {table.name}
                  </h3>
                </div>

                {table.status !== 'free' && (
                  <div className="mt-2 pt-2 border-t border-stone-200/60 space-y-1 text-xs">
                    {table.waiter && (
                      <p className="text-[11px] text-stone-600 truncate">
                        Mozo: <strong>{table.waiter}</strong>
                      </p>
                    )}
                    {table.openedAt && (
                      <p className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Abierta: {table.openedAt}
                      </p>
                    )}
                    <div className="pt-1 flex items-center justify-between font-black text-stone-900">
                      <span>Cuenta:</span>
                      <span className="text-orange-600">S/ {(table.totalCurrent || 0).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Table Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex flex-col gap-1.5">
                {table.status === 'free' ? (
                  <button
                    onClick={() => setActiveTableModal(table)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                  >
                    + Abrir Mesa
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setActiveTableModal(table)}
                      className="py-1.5 bg-white hover:bg-stone-50 text-stone-800 font-bold text-[11px] rounded-lg border border-stone-300"
                    >
                      Ver / Agregar
                    </button>
                    <button
                      onClick={() => handleCloseAndFreeTable(table.id)}
                      className="py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] rounded-lg"
                    >
                      Liberar / Cobrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for viewing or adding to a table */}
      {activeTableModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase">
                  Gestión de Salón
                </span>
                <h3 className="text-xl font-black text-stone-900">
                  {activeTableModal.name} ({activeTableModal.area})
                </h3>
              </div>
              <button
                onClick={() => setActiveTableModal(null)}
                className="text-stone-400 hover:text-stone-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {/* Quick status toggle */}
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Cambiar Estado de la Mesa:
                </label>
                <div className="grid grid-cols-4 gap-1 text-[11px] font-bold">
                  {(['free', 'occupied', 'bill_requested', 'reserved'] as TableStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => updateTableStatus(activeTableModal.id, st)}
                      className={`py-1.5 rounded-lg border capitalize transition-all ${
                        activeTableModal.status === st
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-stone-50 border-stone-200 text-stone-700'
                      }`}
                    >
                      {st === 'free' ? 'Libre' : st === 'occupied' ? 'Ocupada' : st === 'bill_requested' ? 'Cuenta' : 'Reserva'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add dish directly to this table comanda */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <label className="font-extrabold text-stone-800 block">
                  Agregar Plato a la Mesa:
                </label>
                <select
                  value={selectedDishId}
                  onChange={(e) => setSelectedDishId(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-300 rounded-xl font-medium"
                >
                  <option value="">Selecciona un plato del menú...</option>
                  {menu.filter(m => m.inStock).map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} - S/ {m.price.toFixed(2)}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">Cant:</span>
                    <input
                      type="number"
                      min={1}
                      value={addQty}
                      onChange={(e) => setAddQty(Number(e.target.value))}
                      className="w-16 p-1.5 bg-white border border-stone-300 rounded-lg text-center font-bold"
                    />
                  </div>
                  <button
                    onClick={handleAddDishToCurrentTable}
                    disabled={!selectedDishId}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl disabled:opacity-50"
                  >
                    + Enviar a Comanda
                  </button>
                </div>
              </div>

              {/* Total current */}
              <div className="flex justify-between items-center text-sm font-black p-3 bg-orange-50 rounded-2xl border border-orange-200">
                <span>Total Acumulado:</span>
                <span className="text-orange-600 text-base">
                  S/ {(activeTableModal.totalCurrent || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleCloseAndFreeTable(activeTableModal.id)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl"
              >
                Cobrar y Liberar Mesa
              </button>
              <button
                onClick={() => setActiveTableModal(null)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
