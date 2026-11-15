import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, CreditCard, Banknote, Award, Download, Printer, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const { orders } = useApp();

  // Metrics calculation
  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const deliverySales = orders.filter(o => o.type === 'delivery' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const tableSales = orders.filter(o => o.type === 'table' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const takeoutSales = orders.filter(o => o.type === 'takeout' && o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);

  // Sales by payment method
  const yapePlinTotal = orders
    .filter(o => (o.paymentMethod === 'yape' || o.paymentMethod === 'plin') && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const cardTotal = orders
    .filter(o => o.paymentMethod === 'card' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const cashTotal = orders
    .filter(o => o.paymentMethod === 'cash' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const bankTotal = orders
    .filter(o => (o.paymentMethod === 'bcp' || o.paymentMethod === 'bbva') && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Top dishes calculation
  const dishCounts: { [name: string]: { count: number; totalRevenue: number } } = {};
  orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        const name = item.menuItem.name;
        if (!dishCounts[name]) {
          dishCounts[name] = { count: 0, totalRevenue: 0 };
        }
        dishCounts[name].count += item.quantity;
        dishCounts[name].totalRevenue += item.totalPrice;
      });
    }
  });

  const topDishes = Object.entries(dishCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert('No hay órdenes registradas para exportar.');
      return;
    }

    let csvContent = '\uFEFF'; // UTF-8 BOM para compatibilidad con Excel
    csvContent += 'ID Venta;Nº Mesa / Tipo;Cliente;Fecha;Hora;Descripción Plato;Categoría;Precio Unitario;Cantidad;Total Plato;Total Pedido;Método Pago;Estado\n';

    orders.forEach((o, index) => {
      const d = new Date(o.createdAt);
      const fecha = d.toLocaleDateString('es-PE');
      const hora = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
      const tipo = o.type === 'table' ? `Mesa ${o.customer.tableNumber || ''}` : o.type === 'delivery' ? 'Delivery Domicilio' : 'Para Llevar (Recojo)';
      const safeClient = `"${o.customer.name.replace(/"/g, '""')}"`;
      const idVenta = o.orderNumber || `VEN-${100 + index}`;

      o.items.forEach((item, idx) => {
        const isFirst = idx === 0;
        const row = [
          isFirst ? idVenta : '',
          isFirst ? tipo : '',
          isFirst ? safeClient : '',
          fecha,
          hora,
          `"${item.menuItem.name.replace(/"/g, '""')}${item.selectedVariant ? ` (${item.selectedVariant.label})` : ''}"`,
          item.menuItem.category,
          item.unitPrice.toFixed(2),
          item.quantity,
          item.totalPrice.toFixed(2),
          isFirst ? o.total.toFixed(2) : '',
          isFirst ? o.paymentMethod.toUpperCase() : '',
          isFirst ? o.status.toUpperCase() : ''
        ].join(';');

        csvContent += row + '\n';
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ventas_Sabor_Norteno_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-base font-black text-stone-900">
            Cierre de Caja & Reporte de Ventas
          </h2>
          <p className="text-xs text-stone-500">
            Reporte financiero consolidado de pedidos de salón, mostrador y delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Excel (CSV)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Cuadre</span>
          </button>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Ventas Totales Hoy</span>
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              S/
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">
            S/ {totalSales.toFixed(2)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold block mt-1">
            {orders.length} pedidos registrados
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Salón & Mesas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">
            S/ {tableSales.toFixed(2)}
          </p>
          <span className="text-[11px] text-stone-400 font-medium block mt-1">
            Consumo en restaurante
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Delivery a Domicilio</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">
            S/ {deliverySales.toFixed(2)}
          </p>
          <span className="text-[11px] text-stone-400 font-medium block mt-1">
            Repartos Piura
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">Recojo / Mostrador</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-stone-900 mt-2">
            S/ {takeoutSales.toFixed(2)}
          </p>
          <span className="text-[11px] text-stone-400 font-medium block mt-1">
            Para llevar
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Breakdown by Payment Method */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-stone-900">
            Cuadre de Ventas por Medio de Pago
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-black text-[10px] flex items-center justify-center">
                  Y/P
                </span>
                <div>
                  <p className="font-extrabold text-purple-950">Yape / Plin (+51 922 751 087)</p>
                  <p className="text-[10px] text-purple-700">Transferencias móviles QR</p>
                </div>
              </div>
              <span className="text-sm font-black text-purple-950">
                S/ {yapePlinTotal.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-extrabold text-blue-950">Tarjetas de Débito / Crédito</p>
                  <p className="text-[10px] text-blue-700">Visa, Mastercard, POS Izipay/Niubiz</p>
                </div>
              </div>
              <span className="text-sm font-black text-blue-950">
                S/ {cardTotal.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-extrabold text-emerald-950">Efectivo en Caja</p>
                  <p className="text-[10px] text-emerald-700">Monedas y billetes auditados</p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-950">
                S/ {cashTotal.toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-stone-600" />
                <div>
                  <p className="font-extrabold text-stone-900">BCP / BBVA Continental</p>
                  <p className="text-[10px] text-stone-500">Transferencias directas</p>
                </div>
              </div>
              <span className="text-sm font-black text-stone-900">
                S/ {bankTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Top 5 Best Selling Dishes */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-stone-900">
            Platos Más Vendidos de Sabor Norteño
          </h3>

          <div className="space-y-3">
            {topDishes.length === 0 ? (
              <p className="text-xs text-stone-400 py-6 text-center">Sin datos de venta suficientes aún.</p>
            ) : (
              topDishes.map((dish, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <p className="font-extrabold text-stone-900">{dish.name}</p>
                      <p className="text-[11px] text-stone-500">{dish.count} porciones servidas</p>
                    </div>
                  </div>

                  <span className="font-black text-orange-600 text-sm">
                    S/ {dish.totalRevenue.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
