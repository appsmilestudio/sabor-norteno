import React, { useState } from 'react';
import { ShoppingBag, Phone, MapPin, MessageSquare, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { OrderStatus } from '../../types';

export const OnlineOrdersView: React.FC = () => {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  const deliveryOrders = orders.filter(o => o.type === 'delivery' || o.type === 'takeout');
  const filtered = deliveryOrders.filter(o => statusFilter === 'all' || o.status === statusFilter);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'ready':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  const handleNotifyWhatsApp = (order: any, customMsg?: string) => {
    const phone = order.customer.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('51') ? phone : `51${phone}`;
    const text = customMsg || `Hola *${order.customer.name}*, te saludamos de *Sabor Norteño*. Te informamos que tu pedido *#${order.orderNumber}* se encuentra con estado: *${order.status.toUpperCase()}*.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-base font-black text-stone-900">
            Pedidos Online & Delivery
          </h2>
          <p className="text-xs text-stone-500">
            Recepción, despacho y seguimiento de clientes a domicilio y recojo.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl overflow-x-auto text-xs font-bold">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendientes' },
            { id: 'preparing', label: 'En Cocina' },
            { id: 'ready', label: 'Listos' },
            { id: 'delivered', label: 'Entregados' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                statusFilter === st.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-700">No hay pedidos en este estado</h3>
          <p className="text-xs text-stone-400 mt-1">Los nuevos pedidos de clientes en la web aparecerán aquí al instante.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Order Info & Customer */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black text-stone-900">
                    {order.orderNumber}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="font-extrabold text-stone-900">{order.customer.name}</p>
                    <p className="text-stone-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-orange-600" /> {order.customer.phone || 'Sin teléfono'}
                    </p>
                  </div>

                  {order.type === 'delivery' && order.customer.address && (
                    <div>
                      <p className="text-stone-700 flex items-start gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-orange-600 shrink-0 mt-0.5" />
                        <span>{order.customer.address}</span>
                      </p>
                      {order.customer.reference && (
                        <p className="text-[11px] text-stone-400 italic pl-4">
                          Ref: {order.customer.reference}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Items summary */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {order.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-50 border border-stone-200 text-stone-700 text-xs px-2.5 py-1 rounded-lg font-semibold"
                    >
                      {item.quantity}x {item.menuItem.name} {item.selectedVariant ? `(${item.selectedVariant.label})` : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Payment */}
              <div className="text-left lg:text-right shrink-0">
                <span className="text-xs text-stone-400 block font-medium">Total Pedido</span>
                <span className="text-xl font-black text-orange-600">
                  S/ {order.total.toFixed(2)}
                </span>
                <span className="block text-[11px] font-bold text-stone-500 uppercase mt-0.5">
                  Pago: {order.paymentMethod}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 w-full lg:w-48">
                {order.customer.phone && (
                  <button
                    onClick={() => handleNotifyWhatsApp(order)}
                    className="flex-1 lg:w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Cliente</span>
                  </button>
                )}

                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                  className="flex-1 lg:w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl text-xs font-extrabold text-stone-800"
                >
                  <option value="pending">⏳ Pendiente</option>
                  <option value="preparing">🍳 En Cocina</option>
                  <option value="ready">📦 Listo para Salir</option>
                  <option value="delivered">✅ Entregado</option>
                  <option value="cancelled">❌ Cancelado</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
