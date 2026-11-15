import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  Banknote,
  QrCode,
  UtensilsCrossed,
  X,
  ChefHat,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/menuData';
import { MenuItem, CartItem, PaymentMethod, PriceVariant } from '../../types';

export const POSView: React.FC = () => {
  const { menu, tables, createOrder, addItemsToTable, playNotificationSound } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active POS ticket
  const [ticketItems, setTicketItems] = useState<CartItem[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | ''>('');
  const [waiterName, setWaiterName] = useState('Carlos M.');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  
  // Variant modal
  const [variantDish, setVariantDish] = useState<MenuItem | null>(null);

  // Success / Receipt modal
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const categoriesList = useMemo(() => {
    return CATEGORIES;
  }, []);

  const filteredDishes = useMemo(() => {
    return menu.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchQ =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQ;
    });
  }, [menu, selectedCategory, searchQuery]);

  const handleAddDish = (dish: MenuItem, variant?: PriceVariant) => {
    if (!variant && dish.variants && dish.variants.length > 0) {
      setVariantDish(dish);
      return;
    }

    const unitPrice = variant ? variant.price : dish.price;
    const cartItemId = `pos-${dish.id}-${variant ? variant.label : 'std'}`;

    setTicketItems(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * unitPrice }
            : i
        );
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem: dish,
          selectedVariant: variant,
          quantity: 1,
          unitPrice,
          totalPrice: unitPrice
        };
        return [...prev, newItem];
      }
    });

    if (variantDish) setVariantDish(null);
  };

  const handleUpdateQty = (cartItemId: string, delta: number) => {
    setTicketItems(prev =>
      prev
        .map(i => {
          if (i.cartItemId === cartItemId) {
            const newQty = i.quantity + delta;
            if (newQty <= 0) return null;
            return { ...i, quantity: newQty, totalPrice: newQty * i.unitPrice };
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemove = (cartItemId: string) => {
    setTicketItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const clearTicket = () => {
    setTicketItems([]);
    setSelectedTableId('');
    setCustomerName('');
  };

  const subtotal = ticketItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal;

  const handleSendToKitchen = () => {
    if (ticketItems.length === 0) {
      alert('Agrega al menos un plato a la comanda.');
      return;
    }

    if (selectedTableId) {
      addItemsToTable(Number(selectedTableId), ticketItems, waiterName);
    } else {
      createOrder({
        type: 'takeout',
        customer: {
          name: customerName.trim() || 'Barra / Llevar',
          phone: '',
          tableNumber: undefined
        },
        items: [...ticketItems],
        subtotal,
        deliveryFee: 0,
        discount: 0,
        total,
        paymentMethod,
        status: 'pending'
      });
    }

    playNotificationSound();
    alert('🍳 Comanda enviada a Cocina exitosamente.');
    clearTicket();
  };

  const handleChargeAndClose = () => {
    if (ticketItems.length === 0) {
      alert('Agrega al menos un plato para cobrar.');
      return;
    }

    const order = createOrder({
      type: selectedTableId ? 'table' : 'takeout',
      customer: {
        name: selectedTableId ? `Mesa ${selectedTableId}` : (customerName.trim() || 'Venta Rápida'),
        phone: '',
        tableNumber: selectedTableId || undefined
      },
      items: [...ticketItems],
      subtotal,
      deliveryFee: 0,
      discount: 0,
      total,
      paymentMethod,
      status: 'ready'
    });

    setCompletedOrder(order);
    playNotificationSound();
    clearTicket();
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-5 font-sans">
      
      {/* LEFT: Dish Catalogue (Clean & Uncluttered) */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl p-5 border border-stone-200 shadow-xs overflow-hidden">
        
        {/* Top Search & Filter Bar */}
        <div className="space-y-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar plato o bebida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600"
                >
                  ✕
                </button>
              )}
            </div>

            <span className="text-xs text-stone-400 font-bold hidden sm:inline">
              {filteredDishes.length} platos
            </span>
          </div>

          {/* Minimalist Horizontal Categories Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoriesList.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.name.replace(/^[0-9]+\.\s*/, '')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dish Items Grid (Clean Minimal Cards) */}
        <div className="flex-1 overflow-y-auto pt-3 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredDishes.map(dish => (
            <button
              key={dish.id}
              onClick={() => handleAddDish(dish)}
              disabled={!dish.inStock}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                dish.inStock
                  ? 'border-stone-200 bg-white hover:border-orange-500 hover:bg-orange-50/20 active:scale-97 shadow-2xs'
                  : 'opacity-40 border-stone-200 bg-stone-50 cursor-not-allowed'
              }`}
            >
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
                  {dish.name}
                </h4>
                {dish.variants && dish.variants.length > 0 && (
                  <span className="inline-block text-[10px] font-bold text-orange-600 mt-1 bg-orange-50 px-1.5 py-0.5 rounded">
                    Opciones de tamaño
                  </span>
                )}
              </div>

              <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-sm font-black text-stone-900">
                  S/ {dish.price.toFixed(2)}
                </span>
                <span className="w-6 h-6 rounded-lg bg-stone-100 group-hover:bg-orange-600 group-hover:text-white text-stone-500 flex items-center justify-center font-bold text-xs transition-colors">
                  +
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* RIGHT: Order Ticket / Comanda (Sleek, Functional & Focused) */}
      <div className="w-full lg:w-96 bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
        
        {/* Ticket Header & Destination Controls */}
        <div className="space-y-3 pb-3 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-black text-stone-900">Comanda Actual</h3>
            </div>
            {ticketItems.length > 0 && (
              <button
                onClick={clearTicket}
                className="text-[11px] font-bold text-stone-400 hover:text-red-600 transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Clean Mesa / Destino Selector */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] uppercase font-extrabold text-stone-400 block mb-1">
                Destino / Mesa
              </label>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value ? Number(e.target.value) : '')}
                className="w-full py-2 px-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              >
                <option value="">Venta en Barra / Llevar</option>
                {tables.map(t => (
                  <option key={t.id} value={t.id}>
                    Mesa {t.number} ({t.area})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-extrabold text-stone-400 block mb-1">
                Mozo / Personal
              </label>
              <input
                type="text"
                value={waiterName}
                onChange={(e) => setWaiterName(e.target.value)}
                className="w-full py-2 px-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Ticket Items List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {ticketItems.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-2">
              <UtensilsCrossed className="w-10 h-10 mx-auto stroke-1 text-stone-300" />
              <p className="text-xs font-bold text-stone-500">Ticket Vacío</p>
              <p className="text-[11px] text-stone-400 max-w-[180px] mx-auto">
                Toca cualquier plato para agregarlo a la comanda.
              </p>
            </div>
          ) : (
            ticketItems.map(item => (
              <div
                key={item.cartItemId}
                className="p-2.5 bg-stone-50/80 rounded-2xl border border-stone-100 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 truncate leading-tight">
                    {item.menuItem.name}
                  </p>
                  {item.selectedVariant && (
                    <span className="text-[10px] font-bold text-orange-600 block">
                      {item.selectedVariant.label}
                    </span>
                  )}
                  <p className="text-[10px] text-stone-400">
                    S/ {item.unitPrice.toFixed(2)} c/u
                  </p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-stone-200">
                  <button
                    onClick={() => handleUpdateQty(item.cartItemId, -1)}
                    className="w-6 h-6 rounded-lg hover:bg-stone-100 flex items-center justify-center font-bold text-stone-600 active:scale-95"
                  >
                    -
                  </button>
                  <span className="text-xs font-black w-4 text-center text-stone-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQty(item.cartItemId, 1)}
                    className="w-6 h-6 rounded-lg hover:bg-stone-100 flex items-center justify-center font-bold text-stone-600 active:scale-95"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[3.5rem]">
                  <p className="font-black text-stone-900">
                    S/ {item.totalPrice.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(item.cartItemId)}
                  className="text-stone-300 hover:text-red-500 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Ticket Summary & Actions */}
        <div className="pt-3 border-t border-stone-200 space-y-3">
          
          {/* Subtotal & Total */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal ({ticketItems.length} ítems):</span>
              <span className="font-semibold text-stone-800">S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-black text-stone-900 pt-1 border-t border-stone-100">
              <span>Total a Pagar:</span>
              <span className="text-orange-600 text-lg">S/ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Quick Selector */}
          <div>
            <label className="text-[10px] uppercase font-extrabold text-stone-400 block mb-1">
              Medio de Cobro
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
              {[
                { id: 'cash', label: 'Efectivo', icon: Banknote },
                { id: 'yape', label: 'Yape / Plin', icon: QrCode },
                { id: 'card', label: 'Tarjeta', icon: CreditCard },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                  className={`py-2 px-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === p.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <p.icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleSendToKitchen}
              disabled={ticketItems.length === 0}
              className="py-3 px-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChefHat className="w-4 h-4" />
              <span>A Cocina</span>
            </button>

            <button
              onClick={handleChargeAndClose}
              disabled={ticketItems.length === 0}
              className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Receipt className="w-4 h-4" />
              <span>Cobrar Venta</span>
            </button>
          </div>

        </div>

      </div>

      {/* Variant Selection Modal */}
      {variantDish && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600">Elegir Tamaño</span>
                <h3 className="text-base font-black text-stone-900">{variantDish.name}</h3>
              </div>
              <button onClick={() => setVariantDish(null)} className="text-stone-400 hover:text-stone-700 font-bold">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-2">
              {variantDish.variants?.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddDish(variantDish, v)}
                  className="w-full p-3 rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50/40 flex items-center justify-between transition-all"
                >
                  <span className="font-bold text-xs text-stone-800">{v.label}</span>
                  <span className="font-black text-sm text-stone-900">S/ {v.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completed Order Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xs w-full p-6 shadow-2xl border border-stone-200">
            <div className="text-center pb-3 border-b border-dashed border-stone-300">
              <h3 className="text-sm font-black text-stone-900">SABOR NORTEÑO</h3>
              <p className="text-[10px] text-stone-400">Restobar & Cevicheria · Piura</p>
              <div className="mt-2 text-xs font-black text-orange-600 bg-orange-50 py-1 rounded-lg">
                Ticket: {completedOrder.orderNumber}
              </div>
            </div>

            <div className="py-2.5 text-xs space-y-1 border-b border-dashed border-stone-300">
              <div className="flex justify-between text-stone-400 text-[10px]">
                <span>{new Date().toLocaleDateString()}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <p className="font-bold text-stone-800 text-[11px]">
                Destino: {completedOrder.customer.name}
              </p>
              <p className="text-stone-500 text-[10px]">
                Pago: <strong>{completedOrder.paymentMethod.toUpperCase()}</strong>
              </p>
            </div>

            <div className="py-2.5 space-y-1 text-xs border-b border-dashed border-stone-300 max-h-40 overflow-y-auto">
              {completedOrder.items.map((i: any, idx: number) => (
                <div key={idx} className="flex justify-between text-[11px]">
                  <span className="truncate pr-2">{i.quantity}x {i.menuItem.name} {i.selectedVariant ? `(${i.selectedVariant.label})` : ''}</span>
                  <span className="font-bold">S/ {i.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="py-2.5 flex justify-between text-sm font-black text-stone-900 border-b border-dashed border-stone-300">
              <span>TOTAL:</span>
              <span className="text-emerald-600">S/ {completedOrder.total.toFixed(2)}</span>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl"
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
