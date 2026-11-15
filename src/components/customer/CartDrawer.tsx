import React from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const { cart, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-orange-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-black text-stone-900">Tu Pedido</h2>
              <span className="text-xs bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-stone-400 space-y-3">
                <ShoppingBag className="w-16 h-16 mx-auto stroke-1 text-stone-300" />
                <p className="font-bold text-stone-600">Tu canasta está vacía</p>
                <p className="text-xs max-w-xs mx-auto">
                  Explora nuestra carta y agrega tus platos y bebidas favoritas de Sabor Norteño.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl border border-stone-100 bg-stone-50/70 hover:bg-orange-50/30 transition-colors flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-extrabold text-stone-900 leading-tight">
                        {item.menuItem.name}
                      </h4>
                      {item.selectedVariant && (
                        <span className="inline-block text-[11px] font-bold text-orange-700 bg-orange-100/70 px-1.5 py-0.5 rounded mt-1">
                          {item.selectedVariant.label}
                        </span>
                      )}
                      {item.notes && (
                        <p className="text-[11px] text-stone-500 italic mt-0.5">
                          Nota: "{item.notes}"
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-stone-400 hover:text-red-500 p-1 transition-colors"
                      title="Eliminar plato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100 active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-stone-200 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        S/ {item.totalPrice.toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[10px] text-stone-400">
                          (S/ {item.unitPrice.toFixed(2)} c/u)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal productos</span>
                  <span className="font-bold text-stone-900">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Delivery en Piura</span>
                  <span className="font-medium text-emerald-600">Calculado en checkout</span>
                </div>
                <div className="flex justify-between text-base font-black text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total Estimado</span>
                  <span className="text-orange-600">S/ {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 text-xs font-bold text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-stone-200 transition-colors"
                >
                  Vaciar
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <span>Continuar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
