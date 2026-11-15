import React, { useState } from 'react';
import { X, Send, MapPin, Phone, User, CheckCircle2, QrCode, CreditCard, Banknote, UtensilsCrossed } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { OrderType, PaymentMethod } from '../../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart, createOrder } = useApp();

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('yape');
  const [cashAmount, setCashAmount] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const deliveryFee = orderType === 'delivery' ? 5.0 : 0.0;
  const grandTotal = cartTotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor ingresa tu nombre y número de teléfono/WhatsApp.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      alert('Por favor ingresa la dirección de entrega en Piura.');
      return;
    }

    setIsSubmitting(true);

    const newOrder = createOrder({
      type: orderType,
      customer: {
        name: customerName,
        phone: customerPhone,
        address: orderType === 'delivery' ? address : undefined,
        reference: orderType === 'delivery' ? reference : undefined,
        tableNumber: orderType === 'table' ? tableNumber : undefined
      },
      items: [...cart],
      subtotal: cartTotal,
      deliveryFee,
      discount: 0,
      total: grandTotal,
      paymentMethod,
      status: 'pending',
      notes: generalNotes + (paymentMethod === 'cash' && cashAmount ? ` (Paga con: S/ ${cashAmount})` : '')
    });

    // Launch confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }

    // Build WhatsApp message text
    let message = `🍽️ *NUEVO PEDIDO - SABOR NORTEÑO*\n`;
    message += `📋 *Orden:* ${newOrder.orderNumber}\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `📞 *Teléfono:* ${customerPhone}\n`;
    message += `📍 *Tipo:* ${orderType === 'delivery' ? 'Delivery a domicilio' : orderType === 'takeout' ? 'Para llevar (Recojo)' : `Consumo en Mesa ${tableNumber}`}\n`;

    if (orderType === 'delivery') {
      message += `🏠 *Dirección:* ${address}\n`;
      if (reference) message += `📌 *Referencia:* ${reference}\n`;
    }

    message += `\n*DETALLE DE PLATOS:*\n`;
    cart.forEach(item => {
      message += `▪️ ${item.quantity}x ${item.menuItem.name} ${item.selectedVariant ? `(${item.selectedVariant.label})` : ''} - S/ ${item.totalPrice.toFixed(2)}\n`;
      if (item.notes) message += `   _Nota: ${item.notes}_\n`;
    });

    message += `\n💰 *Subtotal:* S/ ${cartTotal.toFixed(2)}\n`;
    if (orderType === 'delivery') {
      message += `🛵 *Envío:* S/ ${deliveryFee.toFixed(2)}\n`;
    }
    message += `💵 *TOTAL A PAGAR:* S/ ${grandTotal.toFixed(2)}\n`;
    message += `💳 *Método de Pago:* ${paymentMethod.toUpperCase()}${paymentMethod === 'cash' && cashAmount ? ` (Paga con S/ ${cashAmount})` : ''}\n`;

    if (generalNotes) {
      message += `\n📝 *Observaciones:* ${generalNotes}\n`;
    }

    const whatsappUrl = `https://wa.me/51922751087?text=${encodeURIComponent(message)}`;

    setCompletedOrderNumber(newOrder.orderNumber);
    clearCart();
    setIsSubmitting(false);

    // Automatically open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  const handleCloseSuccess = () => {
    setCompletedOrderNumber(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 my-8 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={completedOrderNumber ? handleCloseSuccess : onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrderNumber ? (
          /* SUCCESS SCREEN */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                ¡Pedido Registrado con Éxito!
              </span>
              <h3 className="text-2xl font-black text-stone-900 mt-1">
                Orden #{completedOrderNumber}
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 max-w-sm mx-auto">
                Tu comanda ya ingresó al sistema de cocina de <strong>Sabor Norteño</strong> y se abrió la ventana de WhatsApp para coordinar el despacho.
              </p>
            </div>

            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-left text-xs space-y-2">
              <div className="flex justify-between font-bold text-stone-800">
                <span>Total Confirmado:</span>
                <span className="text-orange-600 text-sm font-black">S/ {grandTotal.toFixed(2)}</span>
              </div>
              <p className="text-stone-600 text-[11px]">
                Pago vía: <strong>{paymentMethod.toUpperCase()}</strong> (+51 922 751 087)
              </p>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 transition-all"
            >
              Listo, volver al menú
            </button>
          </div>
        ) : (
          /* CHECKOUT FORM */
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Finalizar Pedido
              </span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight">
                Datos de Entrega y Pago
              </h3>
            </div>

            {/* Order Type Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  orderType === 'delivery'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🛵 Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeout')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  orderType === 'takeout'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🛍️ Para Llevar
              </button>
              <button
                type="button"
                onClick={() => setOrderType('table')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  orderType === 'table'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🍽️ En Mesa
              </button>
            </div>

            {/* Customer Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <User className="w-3.5 h-3.5 text-stone-400" /> Tu Nombre:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <Phone className="w-3.5 h-3.5 text-stone-400" /> Teléfono / WhatsApp:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 922 751 087"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Delivery address or Table number */}
            {orderType === 'delivery' && (
              <div className="space-y-3 p-3.5 bg-orange-50/50 rounded-2xl border border-orange-100">
                <div>
                  <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" /> Dirección de Entrega (Piura):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Av. Grau 450, Urb. Santa Isabel"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 bg-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-600 block mb-1">
                    Referencia o número de departamento:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Frente a la plaza, portón blanco"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 bg-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {orderType === 'table' && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" /> Número de Mesa:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mesa 4"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-200 bg-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Medio de Pago:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yape', label: 'Yape', icon: QrCode },
                  { id: 'plin', label: 'Plin', icon: QrCode },
                  { id: 'card', label: 'Tarjeta', icon: CreditCard },
                  { id: 'bcp', label: 'BCP', icon: CreditCard },
                  { id: 'bbva', label: 'BBVA', icon: CreditCard },
                  { id: 'cash', label: 'Efectivo', icon: Banknote },
                ].map(m => {
                  const isSelected = paymentMethod === m.id;
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`py-2.5 px-2 rounded-xl border text-center flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20'
                          : 'border-stone-200 text-stone-600 hover:border-stone-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Details Note */}
              {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
                <div className="mt-3 p-3 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-900 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Número {paymentMethod.toUpperCase()}:</span>
                    <span className="text-sm font-black">+51 922 751 087</span>
                  </div>
                  <p className="text-[11px] text-purple-700">
                    Titular: Sabor Norteño Restaurante. Puedes adjuntar tu captura al enviar el mensaje por WhatsApp.
                  </p>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="mt-3">
                  <label className="text-xs font-medium text-stone-700 block mb-1">
                    ¿Con cuánto pagarás? (Para llevar tu vuelto exacto):
                  </label>
                  <input
                    type="number"
                    placeholder="Ej. S/ 100"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* General notes */}
            <div>
              <label className="text-xs font-medium text-stone-600 block mb-1">
                Comentarios u observaciones adicionales:
              </label>
              <input
                type="text"
                placeholder="Ej. Tocar timbre 2 veces, enviar cubiertos descartables..."
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Pricing Summary */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal ({cart.length} ítems):</span>
                <span>S/ {cartTotal.toFixed(2)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-stone-600">
                  <span>Costo de Delivery:</span>
                  <span>S/ {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-200">
                <span>Total a Pagar:</span>
                <span className="text-orange-600">S/ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar y Enviar a WhatsApp</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
