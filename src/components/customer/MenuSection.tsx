import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Check,
  Star,
  Sparkles,
  MessageSquare,
  Utensils,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Layers,
  Fish,
  Flame,
  Award,
  CookingPot,
  Soup,
  ChefHat,
  Drumstick,
  Grid,
  Cookie,
  Beer
} from 'lucide-react';
import { CATEGORIES } from '../../data/menuData';
import { MenuItem, PriceVariant } from '../../types';
import { useApp } from '../../context/AppContext';

export const MenuSection: React.FC = () => {
  const { menu, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDropdownCat, setSelectedDropdownCat] = useState<string>('all');

  // Map category icons
  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'entradas': return Cookie;
      case 'ceviches': return Fish;
      case 'causas': return Layers;
      case 'piqueos': return Flame;
      case 'rondas': return Award;
      case 'chicharrones': return Sparkles;
      case 'arroces': return CookingPot;
      case 'sudados': return Soup;
      case 'almuerzos': return ChefHat;
      case 'alitas': return Drumstick;
      case 'combos': return Grid;
      case 'bebidas': return Beer;
      default: return Utensils;
    }
  };

  // State to track which categories are expanded/collapsed
  // Collapsed by default on the main screen for a clean, professional view
  const [openCategories, setOpenCategories] = useState<{ [catId: string]: boolean }>({});

  // Customization modal state
  const [activeDish, setActiveDish] = useState<MenuItem | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<PriceVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [dishNotes, setDishNotes] = useState<string>('');
  const [addedAnimationId, setAddedAnimationId] = useState<string | null>(null);

  // Toggle single category
  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Expand all or collapse all
  const expandAll = () => {
    const allOpen: { [k: string]: boolean } = {};
    CATEGORIES.filter(c => c.id !== 'all').forEach(c => {
      allOpen[c.id] = true;
    });
    setOpenCategories(allOpen);
  };

  const collapseAll = () => {
    const allClosed: { [k: string]: boolean } = {};
    CATEGORIES.filter(c => c.id !== 'all').forEach(c => {
      allClosed[c.id] = false;
    });
    setOpenCategories(allClosed);
  };

  // Filtered dishes grouped by category in ordered sequence
  const orderedCategories = useMemo(() => {
    return CATEGORIES.filter(c => c.id !== 'all');
  }, []);

  const dishesByCategory = useMemo(() => {
    const grouped: { [catId: string]: MenuItem[] } = {};
    orderedCategories.forEach(cat => {
      grouped[cat.id] = menu.filter(item => {
        const matchesCategory = item.category === cat.id;
        const matchesSearch =
          searchQuery.trim() === '' ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      });
    });
    return grouped;
  }, [menu, orderedCategories, searchQuery]);

  // When searching, auto-expand categories that have matches
  React.useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const autoOpen: { [k: string]: boolean } = {};
      Object.keys(dishesByCategory).forEach(catId => {
        if (dishesByCategory[catId].length > 0) {
          autoOpen[catId] = true;
        }
      });
      setOpenCategories(autoOpen);
    }
  }, [searchQuery, dishesByCategory]);

  const handleDropdownSelect = (catId: string) => {
    setSelectedDropdownCat(catId);
    if (catId === 'all') {
      expandAll();
    } else {
      setOpenCategories(prev => ({ ...prev, [catId]: true }));
      const el = document.getElementById(`cat-accordion-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleQuickAdd = (item: MenuItem) => {
    if (item.variants && item.variants.length > 0) {
      setActiveDish(item);
      setSelectedVariant(item.variants[0]);
      setQuantity(1);
      setDishNotes('');
    } else {
      addToCart(item, undefined, 1, '');
      setAddedAnimationId(item.id);
      setTimeout(() => setAddedAnimationId(null), 1200);
    }
  };

  const handleConfirmCustomDish = () => {
    if (!activeDish) return;
    addToCart(activeDish, selectedVariant, quantity, dishNotes);
    setAddedAnimationId(activeDish.id);
    setTimeout(() => setAddedAnimationId(null), 1200);
    setActiveDish(null);
  };

  const totalMatchingDishes = Object.values(dishesByCategory).reduce(
    (sum, list) => sum + list.length,
    0
  );

  return (
    <section id="menu-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="text-xs font-black uppercase tracking-widest text-orange-600 bg-orange-100/80 border border-orange-200 px-3.5 py-1 rounded-full">
          Nuestra Gastronomía
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 mt-2 tracking-tight">
          Menú Digital & Carta Oficial
        </h2>
        <p className="text-stone-600 mt-2 text-sm sm:text-base">
          Explora nuestra carta organizada paso a paso. Haz clic en cada categoría para desplegar sus platos típicos, precios e ingredientes.
        </p>
      </div>

      {/* Control Bar: Search + Category Dropdown Selector + Expand/Collapse Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar ceviche, seco de chavelo, majado, ronda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desplegable de Categorías (Dropdown Selector) */}
          <div className="md:col-span-4 relative">
            <select
              value={selectedDropdownCat}
              onChange={(e) => handleDropdownSelect(e.target.value)}
              className="w-full py-2.5 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs sm:text-sm font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer transition-all"
            >
              <option value="all">📂 Desplegar: Todas las Categorías</option>
              {orderedCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({dishesByCategory[cat.id]?.length || 0} platos)
                </option>
              ))}
            </select>
          </div>

          {/* Expand / Collapse All Quick Actions */}
          <div className="md:col-span-2 flex items-center justify-end gap-1.5">
            <button
              onClick={expandAll}
              className="flex-1 md:flex-none px-3 py-2 text-xs font-bold text-stone-700 hover:text-orange-600 bg-stone-100 hover:bg-orange-50 rounded-xl border border-stone-200 transition-colors"
              title="Expandir todas las categorías"
            >
              Expandir
            </button>
            <button
              onClick={collapseAll}
              className="flex-1 md:flex-none px-3 py-2 text-xs font-bold text-stone-700 hover:text-orange-600 bg-stone-100 hover:bg-orange-50 rounded-xl border border-stone-200 transition-colors"
              title="Colapsar todas las categorías"
            >
              Colapsar
            </button>
          </div>

        </div>

        {/* Status line */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>
            Mostrando <strong>{totalMatchingDishes} platos</strong> organizados en <strong>12 secciones culinarias</strong>
          </span>
          {searchQuery && (
            <span className="text-orange-600 font-bold">
              Filtro por búsqueda: "{searchQuery}"
            </span>
          )}
        </div>
      </div>

      {/* ACCORDION CATEGORIES (DESPLEGABLES) */}
      <div className="space-y-4">
        {orderedCategories.map((category) => {
          const dishes = dishesByCategory[category.id] || [];
          const isOpen = !!openCategories[category.id];
          const CategoryIcon = getCategoryIcon(category.id);

          // If searching and this category has no matches, hide the category header
          if (searchQuery.trim() !== '' && dishes.length === 0) {
            return null;
          }

          return (
            <div
              key={category.id}
              id={`cat-accordion-${category.id}`}
              className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden transition-all duration-300"
            >
              {/* ACCORDION HEADER (CLICK TO EXPAND / COLLAPSE) */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className={`w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors ${
                  isOpen ? 'bg-orange-50/50 border-b border-orange-100' : 'hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    isOpen
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'bg-stone-100 text-stone-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}>
                    <CategoryIcon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-stone-900">
                        {category.name}
                      </h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                        {dishes.length} {dishes.length === 1 ? 'plato' : 'platos'}
                      </span>
                    </div>
                    {category.description && (
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5 font-medium">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Chevron indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline text-xs font-bold text-stone-400">
                    {isOpen ? 'Ocultar' : 'Desplegar'}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-stone-100 text-stone-600 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-orange-100 text-orange-700' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </button>

              {/* ACCORDION CONTENT (DISHES GRID) */}
              {isOpen && (
                <div className="p-4 sm:p-6 bg-stone-50/40 animate-in fade-in duration-300">
                  {dishes.length === 0 ? (
                    <div className="text-center py-8 text-stone-400 text-xs font-medium">
                      No hay platos en esta categoría que coincidan con la búsqueda.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {dishes.map((item) => {
                        const isAdded = addedAnimationId === item.id;
                        const hasVariants = item.variants && item.variants.length > 0;

                        return (
                          <div
                            key={item.id}
                            className={`bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 flex flex-col justify-between group hover:shadow-md hover:border-orange-300 ${
                              !item.inStock ? 'opacity-60 bg-stone-50' : ''
                            }`}
                          >
                            <div>
                              {/* Dish Badges */}
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                                  {item.category.replace('_', ' ')}
                                </span>
                                <div className="flex items-center gap-1">
                                  {item.isPopular && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Favorito
                                    </span>
                                  )}
                                  {item.isChefSpecial && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                                      <Sparkles className="w-3 h-3 text-red-500" /> Especial
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Title & Description */}
                              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 group-hover:text-orange-600 transition-colors leading-snug">
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-stone-500 text-xs leading-relaxed mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Bottom Row: Price & Action */}
                            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-stone-400 block font-medium">
                                  {hasVariants ? 'Desde' : 'Precio'}
                                </span>
                                <span className="text-base sm:text-lg font-black text-stone-900">
                                  S/ {item.price.toFixed(2)}
                                </span>
                              </div>

                              {item.inStock ? (
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdd(item)}
                                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                    isAdded
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white border border-orange-200 hover:border-transparent shadow-xs'
                                  }`}
                                >
                                  {isAdded ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" /> Agregado
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>{hasVariants ? 'Elegir' : 'Agregar'}</span>
                                    </>
                                  )}
                                </button>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded-lg">
                                  <AlertCircle className="w-3 h-3" /> Agotado hoy
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dish Customization Modal */}
      {activeDish && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                  Configurar Plato
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-0.5">
                  {activeDish.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDish(null)}
                className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {activeDish.description && (
              <p className="text-xs text-stone-500 mt-2">
                {activeDish.description}
              </p>
            )}

            {/* Variants Selector */}
            {activeDish.variants && activeDish.variants.length > 0 && (
              <div className="mt-4">
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  Selecciona la porción / tamaño:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeDish.variants.map((v, idx) => {
                    const isSelected = selectedVariant?.label === v.label;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50/70 text-orange-900 ring-2 ring-orange-500/20'
                            : 'border-stone-200 hover:border-orange-200 text-stone-700'
                        }`}
                      >
                        <span className="text-xs font-bold">{v.label}</span>
                        <span className="text-sm font-black text-orange-600 mt-1">
                          S/ {v.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Notes */}
            <div className="mt-4">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                Instrucciones especiales para la cocina:
              </label>
              <input
                type="text"
                placeholder="Ej. Sin cebolla, ají bien picante, ají aparte..."
                value={dishNotes}
                onChange={(e) => setDishNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            {/* Quantity */}
            <div className="mt-5 flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-100">
              <span className="text-xs font-bold text-stone-700">Cantidad:</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100 active:scale-95"
                >
                  -
                </button>
                <span className="text-sm font-black w-6 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-stone-300 font-bold text-stone-700 flex items-center justify-center hover:bg-stone-100 active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total and Action */}
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-stone-400 block font-medium">Total</span>
                <span className="text-xl font-black text-stone-900">
                  S/ {(((selectedVariant ? selectedVariant.price : activeDish.price)) * quantity).toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmCustomDish}
                className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 transition-all"
              >
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
