import React, { useState } from 'react';
import { ChefHat, Clock, Check, Bell, Flame, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const KitchenView: React.FC = () => {
  const { orders, updateOrderStatus, playNotificationSound } = useApp();
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  // Filter kitchen-relevant orders
  const kitchenOrders = orders.filter(order => {
    if (filter === 'active') {
      return order.status === 'pending' || order.status === 'preparing';
    }
    return order.status !== 'cancelled';
  });

  const getElapsedTime = (isoString: string) => {
    const elapsedMinutes = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    return elapsedMinutes;
  };

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-stone-900">
              Kitchen Display System (KDS) · Monitor de Cocina
            </h2>
            <p className="text-xs text-stone-500">
              Control de preparación de platos fríos (cevichería) y calientes (cocina criolla).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={playNotificationSound}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold border border-stone-200"
          >
            <Bell className="w-4 h-4 text-orange-600" />
            <span>Alerta Sonora</span>
          </button>

          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'active' ? 'bg-orange-600 text-white' : 'text-stone-600'
              }`}
            >
              En Cocina ({orders.filter(o => o.status === 'pending' || o.status === 'preparing').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === 'all' ? 'bg-orange-600 text-white' : 'text-stone-600'
              }`}
            >
              Historial del Día
            </button>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {kitchenOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <ChefHat className="w-16 h-16 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">Cocina al día</h3>
          <p className="text-xs text-stone-400 mt-1">No hay comandas pendientes de preparación en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kitchenOrders.map(order => {
            const minutes = getElapsedTime(order.createdAt);
            const isLate = minutes >= 20;
            const isPending = order.status === 'pending';
            const isPreparing = order.status === 'preparing';

            return (
              <div
                key={order.id}
                className={`rounded-3xl border-2 p-4 shadow-sm flex flex-col justify-between transition-all bg-white ${
                  isLate ? 'border-red-400 ring-2 ring-red-400/20' : isPreparing ? 'border-amber-400' : 'border-stone-200'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-sm font-black text-stone-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        order.type === 'table'
                          ? 'bg-blue-100 text-blue-800'
                          : order.type === 'delivery'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {order.type === 'table' ? `Mesa ${order.customer.tableNumber || ''}` : order.type}
                    </span>
                  </div>

                  {/* Customer & Time */}
                  <div className="py-2 flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700 truncate max-w-[140px]">
                      {order.customer.name}
                    </span>
                    <span
                      className={`font-black flex items-center gap-1 px-2 py-0.5 rounded-md ${
                        isLate
                          ? 'bg-red-500 text-white animate-pulse'
                          : minutes >= 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <Clock className="w-3 h-3" /> {minutes} min
                    </span>
                  </div>

                  {order.waiter && (
                    <div className="pb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-stone-500">
                      <span>Mozo:</span>
                      <span className="text-stone-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-200">
                        📱 {order.waiter}
                      </span>
                    </div>
                  )}

                  {/* Items list */}
                  <div className="py-2 space-y-2 border-t border-stone-100">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-stone-50 border border-stone-100 text-xs"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-black text-stone-900">
                            {item.quantity}x {item.menuItem.name}
                          </span>
                          {item.selectedVariant && (
                            <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.2 rounded">
                              {item.selectedVariant.label}
                            </span>
                          )}
                        </div>

                        {item.notes && (
                          <p className="text-[11px] text-red-600 font-bold mt-1 bg-red-50 p-1 rounded border border-red-200">
                            ⚠️ {item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-1 p-2 rounded-lg bg-amber-50 text-[11px] text-amber-900 border border-amber-200">
                      <strong>Nota general:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Kitchen Status Actions */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
                  {isPending && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Comenzar a Cocinar</span>
                    </button>
                  )}

                  {isPreparing && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Platos Listos / Despachar</span>
                    </button>
                  )}

                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      Marcar Entregado
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
