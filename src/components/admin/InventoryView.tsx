import React, { useState } from 'react';
import { Boxes, AlertTriangle, Check, RefreshCw, Plus, Minus, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InventoryView: React.FC = () => {
  const { inventory, updateInventoryStock, menu, toggleItemStock } = useApp();
  const [activeTab, setActiveTab] = useState<'supplies' | 'dishes'>('supplies');
  const [searchQuery, setSearchQuery] = useState('');

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDishes = menu.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Low Stock Alerts */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-stone-900">
              Control de Inventario & Disponibilidad
            </h2>
            <p className="text-xs text-stone-500">
              Gestiona insumos críticos de cocina y activa o agota platos de la carta en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('supplies')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'supplies'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📦 Insumos & Stock
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === 'dishes'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🍽️ Platos Disponibles / Agotados
            </button>
          </div>
        </div>

        {/* Low Stock Warning Banner */}
        {lowStockItems.length > 0 && activeTab === 'supplies' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 font-medium">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>¡Atención!</strong> Hay {lowStockItems.length} insumos con stock por debajo del mínimo recomendado: {lowStockItems.map(i => i.name).join(', ')}.
            </span>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder={activeTab === 'supplies' ? 'Buscar insumo (pescado, plátano, limón...)' : 'Buscar plato para agotar/activar...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />
      </div>

      {/* TAB 1: SUPPLIES / INGREDIENTS */}
      {activeTab === 'supplies' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Insumo / Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Stock Actual</th>
                  <th className="py-3 px-4">Stock Mínimo</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Ajuste Rápido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInventory.map(item => {
                  const isLow = item.stock <= item.minStock;

                  return (
                    <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-stone-500 capitalize">
                        {item.category.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 font-black text-stone-900">
                        {item.stock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {item.minStock} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isLow
                              ? 'bg-red-100 text-red-800 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {isLow ? 'Stock Bajo' : 'Óptimo'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => updateInventoryStock(item.id, Math.max(0, item.stock - 1))}
                            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateInventoryStock(item.id, item.stock + 1)}
                            className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MENU DISHES TOGGLE AVAILABILITY */}
      {activeTab === 'dishes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDishes.map(dish => (
            <div
              key={dish.id}
              className={`p-4 rounded-3xl border transition-all flex items-center justify-between ${
                dish.inStock
                  ? 'bg-white border-stone-200 shadow-sm'
                  : 'bg-stone-100 border-stone-300 opacity-70'
              }`}
            >
              <div className="pr-3">
                <span className="text-[10px] font-black uppercase text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                  {dish.category}
                </span>
                <h4 className="text-xs font-black text-stone-900 mt-1">
                  {dish.name}
                </h4>
                <p className="text-xs font-extrabold text-stone-700 mt-0.5">
                  S/ {dish.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => toggleItemStock(dish.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  dish.inStock
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-stone-400 hover:bg-stone-500 text-white'
                }`}
              >
                {dish.inStock ? 'Disponible' : 'Agotado'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
