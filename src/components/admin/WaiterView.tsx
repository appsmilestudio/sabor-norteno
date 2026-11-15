import React, { useState, useMemo } from 'react';
import {
  Smartphone,
  Search,
  Plus,
  Minus,
  Trash2,
  ChefHat,
  CheckCircle2,
  UtensilsCrossed,
  MessageSquare,
  X,
  ChevronDown,
  Layers,
  Fish,
  Flame,
  Award,
  Sparkles,
  CookingPot,
  Soup,
  Drumstick,
  Grid,
  Cookie,
  Beer,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/menuData';
import { MenuItem, CartItem, PriceVariant } from '../../types';

export const WaiterView: React.FC = () => {
  const { menu, tables, addItemsToTable, playNotificationSound } = useApp();

  const [selectedTableId, setSelectedTableId] = useState<number>(1);
  const [waiterName, setWaiterName] = useState<string>('Carlos M.');
  const [selectedCat, setSelectedCat] = useState<string>('entradas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Active comanda items for the current table
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  
  // Customization note modal
  const [editingItemNotes, setEditingItemNotes] = useState<CartItem | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  
  // Variant selection modal
  const [variantDish, setVariantDish] = useState<MenuItem | null>(null);

  // Review drawer open/close
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);

  // Success alert
  const [sentSuccessTable, setSentSuccessTable] = useState<number | null>(null);

  const currentTable = tables.find(t => t.id === selectedTableId) || tables[0];

  const categories = useMemo(() => {
    return CATEGORIES.filter(c => c.id !== 'all');
  }, []);

  const filteredDishes = useMemo(() => {
    return menu.filter(item => {
      const matchCat = searchQuery.trim() !== '' ? true : item.category === selectedCat;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [menu, selectedCat, searchQuery]);

  const handleAddDish = (dish: MenuItem, variant?: PriceVariant) => {
    if (!variant && dish.variants && dish.variants.length > 0) {
      setVariantDish(dish);
      return;
    }

    const unitPrice = variant ? variant.price : dish.price;
    const cartItemId = `mozo-${dish.id}-${variant ? variant.label : 'std'}`;

    setOrderItems(prev => {
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
    setOrderItems(prev =>
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

  const handleSaveNotes = () => {
    if (!editingItemNotes) return;
    setOrderItems(prev =>
      prev.map(i =>
        i.cartItemId === editingItemNotes.cartItemId
          ? { ...i, notes: noteText.trim() }
          : i
      )
    );
    setEditingItemNotes(null);
    setNoteText('');
  };

  const totalItemsCount = orderItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = orderItems.reduce((acc, i) => acc + i.totalPrice, 0);

  const handleSendComanda = () => {
    if (orderItems.length === 0) {
      alert('Agrega al menos un plato a la comanda.');
      return;
    }

    addItemsToTable(selectedTableId, orderItems, waiterName);
    playNotificationSound();

    setSentSuccessTable(currentTable.number);
    setOrderItems([]);
    setIsReviewOpen(false);

    setTimeout(() => {
      setSentSuccessTable(null);
    }, 3500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-28 space-y-4 font-sans">
      
      {/* SUCCESS FLOATING TOAST */}
      {sentSuccessTable && (
        <div className="fixed top-5 left-4 right-4 z-50 max-w-md mx-auto bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <div className="flex-1">
            <h4 className="font-black text-sm">¡Comanda Enviada a Cocina!</h4>
            <p className="text-xs text-emerald-100">
              Mesa {sentSuccessTable} actualizada. Cocineros notificados con alerta sonora.
            </p>
          </div>
        </div>
      )}

      {/* TOP BAR: TABLE & WAITER SELECTOR */}
      <div className="bg-stone-900 text-white p-4 rounded-3xl shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/95 p-0.5 border border-orange-400 overflow-hidden shrink-0 shadow-xs">
              <img src="/mascot.png" alt="Mozo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-base font-black tracking-tight">Comandero Rápido</h2>
          </div>
          <span className="text-[11px] font-bold text-stone-300 bg-stone-800 px-2.5 py-1 rounded-full border border-stone-700">
            📱 Modo Mozo
          </span>
        </div>

        {/* Mesa & Mozo selector buttons */}
        <div className="grid grid-cols-2 gap-2">
          {/* Table select */}
          <div className="bg-stone-800 p-2 rounded-2xl border border-stone-700">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
              Mesa de Atención:
            </label>
            <select
              value={selectedTableId}
              onChange={(e) => setSelectedTableId(Number(e.target.value))}
              className="w-full bg-stone-900 text-white font-black text-sm py-1 px-2 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
            >
              {tables.map(t => (
                <option key={t.id} value={t.id}>
                  Mesa {t.number} ({t.area}) {t.status === 'occupied' ? '• Ocupada' : '• Libre'}
                </option>
              ))}
            </select>
          </div>

          {/* Waiter Name */}
          <div className="bg-stone-800 p-2 rounded-2xl border border-stone-700">
            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
              Mozo a Cargo:
            </label>
            <select
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
              className="w-full bg-stone-900 text-white font-bold text-sm py-1 px-2 rounded-xl border border-stone-700 focus:outline-none focus:border-orange-500"
            >
              <option value="Carlos M.">Carlos M.</option>
              <option value="Rosa P.">Rosa P.</option>
              <option value="Juan C.">Juan C.</option>
              <option value="Lissette V.">Lissette V.</option>
            </select>
          </div>
        </div>

        {/* Current Table State */}
        {currentTable.status === 'occupied' && (
          <div className="text-xs bg-amber-500/20 text-amber-300 p-2 rounded-xl border border-amber-500/30 flex items-center justify-between">
            <span>Esta mesa tiene comanda abierta</span>
            <span className="font-black">Consumo: S/ {(currentTable.totalCurrent || 0).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* QUICK SEARCH */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar plato rápido (chifles, ceviche, ronda...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-8 py-2.5 bg-white border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400"
          >
            ✕
          </button>
        )}
      </div>

      {/* CATEGORY TABS (HORIZONTAL TOUCH BAR) */}
      {!searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                  isSelected
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30 scale-102'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200'
                }`}
              >
                {cat.name.replace(/^[0-9]+\.\s*/, '')}
              </button>
            );
          })}
        </div>
      )}

      {/* DISHES LIST FOR THIS CATEGORY (TOUCH FRIENDLY FOR PHONES) */}
      <div className="space-y-2">
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-stone-200 text-stone-400 text-xs font-medium">
            No se encontraron platos.
          </div>
        ) : (
          filteredDishes.map(dish => {
            // Check if already in current comanda
            const inOrder = orderItems.filter(i => i.menuItem.id === dish.id);
            const totalQtyInOrder = inOrder.reduce((sum, i) => sum + i.quantity, 0);

            return (
              <div
                key={dish.id}
                className={`bg-white rounded-2xl p-3.5 border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                  totalQtyInOrder > 0
                    ? 'border-orange-500 bg-orange-50/20'
                    : 'border-stone-200 hover:border-orange-300'
                }`}
              >
                {/* Dish Name & Price */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleAddDish(dish)}
                >
                  <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                    {dish.name}
                  </h4>
                  {dish.variants && dish.variants.length > 0 && (
                    <span className="text-[10px] text-orange-600 font-bold block mt-0.5">
                      Varios tamaños disponibles
                    </span>
                  )}
                  <span className="text-xs font-black text-stone-700 block mt-1">
                    S/ {dish.price.toFixed(2)}
                  </span>
                </div>

                {/* Counter / Quick Add Touch Buttons */}
                <div className="flex items-center gap-2">
                  {totalQtyInOrder > 0 ? (
                    <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                      <button
                        onClick={() => {
                          const item = inOrder[0];
                          if (item) handleUpdateQty(item.cartItemId, -1);
                        }}
                        className="w-8 h-8 rounded-lg bg-white font-black text-stone-800 flex items-center justify-center text-sm active:scale-95 shadow-2xs"
                      >
                        -
                      </button>
                      <span className="w-5 text-center font-black text-sm text-stone-900">
                        {totalQtyInOrder}
                      </span>
                      <button
                        onClick={() => handleAddDish(dish)}
                        className="w-8 h-8 rounded-lg bg-orange-600 text-white font-black flex items-center justify-center text-sm active:scale-95 shadow-2xs"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddDish(dish)}
                      className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* STICKY BOTTOM BAR FOR PHONES (ENVIAR COMANDA A COCINA) */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-3 left-4 right-4 z-40 max-w-xl mx-auto">
          <div className="bg-stone-900 text-white p-3.5 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* View Comanda Summary Trigger */}
            <button
              onClick={() => setIsReviewOpen(true)}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-sm shadow">
                {totalItemsCount}
              </div>
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  Mesa {currentTable.number} ({currentTable.area})
                </span>
                <span className="text-base font-black text-white">
                  S/ {totalAmount.toFixed(2)}
                </span>
              </div>
            </button>

            {/* SEND DIRECTLY TO KITCHEN BUTTON */}
            <button
              onClick={handleSendComanda}
              className="py-3 px-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 active:scale-95 transition-all"
            >
              <ChefHat className="w-4 h-4" />
              <span>Enviar a Cocina</span>
            </button>

          </div>
        </div>
      )}

      {/* COMANDA REVIEW DRAWER MODAL */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-600">Revisar Comanda</span>
                <h3 className="text-lg font-black text-stone-900">
                  Mesa {currentTable.number} · {waiterName}
                </h3>
              </div>
              <button
                onClick={() => setIsReviewOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {orderItems.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-stone-900 truncate">{item.menuItem.name}</p>
                    {item.selectedVariant && (
                      <span className="text-[10px] font-bold text-orange-600 block">
                        {item.selectedVariant.label}
                      </span>
                    )}
                    {item.notes ? (
                      <p className="text-[10px] text-red-600 font-bold italic">
                        Nota: "{item.notes}"
                      </p>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingItemNotes(item);
                          setNoteText(item.notes || '');
                        }}
                        className="text-[10px] text-stone-400 hover:text-orange-600 flex items-center gap-1 mt-0.5"
                      >
                        <MessageSquare className="w-3 h-3" /> Agregar nota a cocina
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdateQty(item.cartItemId, -1)}
                      className="w-6 h-6 rounded bg-white border border-stone-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-black">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.cartItemId, 1)}
                      className="w-6 h-6 rounded bg-white border border-stone-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-black text-stone-900 min-w-[3rem] text-right">
                    S/ {item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total and Send Button */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <div className="flex justify-between items-center text-sm font-black text-stone-900">
                <span>Total Comanda:</span>
                <span className="text-orange-600 text-lg">S/ {totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={handleSendComanda}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2"
              >
                <ChefHat className="w-5 h-5" />
                <span>Confirmar y Enviar a Cocina</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VARIANT MODAL */}
      {variantDish && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-sm font-black text-stone-900">{variantDish.name}</h3>
              <button onClick={() => setVariantDish(null)} className="text-stone-400">✕</button>
            </div>
            <div className="py-3 space-y-2">
              {variantDish.variants?.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddDish(variantDish, v)}
                  className="w-full p-3 rounded-xl border border-stone-200 hover:border-orange-500 hover:bg-orange-50 flex items-center justify-between text-xs font-bold"
                >
                  <span>{v.label}</span>
                  <span className="text-orange-600 font-black text-sm">S/ {v.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NOTE EDIT MODAL */}
      {editingItemNotes && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 space-y-3">
            <h4 className="text-xs font-black text-stone-900">
              Nota de preparación para: {editingItemNotes.menuItem.name}
            </h4>
            <input
              type="text"
              placeholder="Ej. Sin cebolla, ají aparte, bien cocido..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveNotes}
                className="flex-1 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl"
              >
                Guardar Nota
              </button>
              <button
                onClick={() => setEditingItemNotes(null)}
                className="px-3 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
