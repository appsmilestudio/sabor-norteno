import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuItem, CartItem, Order, RestaurantTable, Reservation, InventoryItem, OrderStatus, TableStatus } from '../types';
import { INITIAL_MENU, INITIAL_TABLES, INITIAL_INVENTORY } from '../data/menuData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  // Navigation / Mode
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  adminSubView: 'waiter' | 'pos' | 'tables' | 'kitchen' | 'online_orders' | 'inventory' | 'reservations' | 'reports';
  setAdminSubView: (view: 'waiter' | 'pos' | 'tables' | 'kitchen' | 'online_orders' | 'inventory' | 'reservations' | 'reports') => void;

  // POS Animation Transition
  isPOSTransitioning: boolean;
  enterPOSWithAnimation: (subView?: 'waiter' | 'pos' | 'tables' | 'kitchen' | 'online_orders' | 'inventory' | 'reservations' | 'reports') => void;
  finishPOSTransition: () => void;

  // Database Connection Status
  isLiveDatabase: boolean;

  // Menu
  menu: MenuItem[];
  toggleItemStock: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, variant?: { label: string; price: number }, quantity?: number, notes?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Tables
  tables: RestaurantTable[];
  updateTableStatus: (tableId: number, status: TableStatus) => void;
  addItemsToTable: (tableId: number, items: CartItem[], waiter?: string) => void;
  closeTableAccount: (tableId: number) => void;

  // Reservations
  reservations: Reservation[];
  createReservation: (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (id: string, status: 'confirmed' | 'pending' | 'cancelled') => void;

  // Inventory
  inventory: InventoryItem[];
  updateInventoryStock: (id: string, newStock: number) => void;

  // Audio alerts
  playNotificationSound: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Multi-tab real-time sync channel
const localSyncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('sabor_norteno_channel')
  : null;

// Sound alert using authentic MP3 with Web Audio API fallback
const playTone = () => {
  try {
    const audio = new Audio('/sound/pedidolisto.mp3');
    audio.play().catch(() => {
      // Fallback synthesizer
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    });
  } catch (e) {
    console.error('Audio play error:', e);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [adminSubView, setAdminSubView] = useState<'waiter' | 'pos' | 'tables' | 'kitchen' | 'online_orders' | 'inventory' | 'reservations' | 'reports'>('pos');
  const [isPOSTransitioning, setIsPOSTransitioning] = useState<boolean>(false);
  const [isLiveDatabase, setIsLiveDatabase] = useState<boolean>(isSupabaseConfigured());

  const enterPOSWithAnimation = (subView: 'waiter' | 'pos' | 'tables' | 'kitchen' | 'online_orders' | 'inventory' | 'reservations' | 'reports' = 'pos') => {
    setAdminSubView(subView);
    setIsPOSTransitioning(true);
  };

  const finishPOSTransition = () => {
    setIsAdminView(true);
    setIsPOSTransitioning(false);
  };

  // Load Menu with LocalStorage fallback
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sn_menu');
    return saved ? JSON.parse(saved) : INITIAL_MENU;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sn_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sn_orders');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ord-101',
        orderNumber: 'SN-101',
        type: 'delivery',
        customer: {
          name: 'Renato Castillo',
          phone: '+51 969 123 456',
          address: 'Urb. Los Algarrobos Mz. C Lote 12, Piura',
          reference: 'Frente al parque principal'
        },
        items: [
          {
            cartItemId: 'item-1',
            menuItem: INITIAL_MENU.find(m => m.id === 'cev-1') || INITIAL_MENU[0],
            selectedVariant: { label: 'Fuente Familiar', price: 45.0 },
            quantity: 1,
            unitPrice: 45.0,
            totalPrice: 45.0,
            notes: 'Bastante cebolla y ají aparte'
          },
          {
            cartItemId: 'item-2',
            menuItem: INITIAL_MENU.find(m => m.id === 'piq-2') || INITIAL_MENU[1],
            quantity: 1,
            unitPrice: 35.0,
            totalPrice: 35.0
          },
          {
            cartItemId: 'item-3',
            menuItem: INITIAL_MENU.find(m => m.id === 'beb-1') || INITIAL_MENU[2],
            quantity: 1,
            unitPrice: 15.0,
            totalPrice: 15.0
          }
        ],
        subtotal: 95.0,
        deliveryFee: 5.0,
        discount: 0,
        total: 100.0,
        paymentMethod: 'yape',
        status: 'preparing',
        createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
        estimatedTime: '30-40 min'
      },
      {
        id: 'ord-102',
        orderNumber: 'SN-102',
        type: 'table',
        waiter: 'Carlos M.',
        customer: {
          name: 'Mesa 1 (Salón)',
          phone: '',
          tableNumber: 1
        },
        items: [
          {
            cartItemId: 'item-4',
            menuItem: INITIAL_MENU.find(m => m.id === 'tri-1') || INITIAL_MENU[3],
            quantity: 1,
            unitPrice: 40.0,
            totalPrice: 40.0
          },
          {
            cartItemId: 'item-5',
            menuItem: INITIAL_MENU.find(m => m.id === 'cer-2') || INITIAL_MENU[4],
            quantity: 2,
            unitPrice: 11.0,
            totalPrice: 22.0
          }
        ],
        subtotal: 62.0,
        deliveryFee: 0,
        discount: 0,
        total: 62.0,
        paymentMethod: 'cash',
        status: 'ready',
        createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString()
      }
    ];
  });

  // Tables
  const [tables, setTables] = useState<RestaurantTable[]>(() => {
    const saved = localStorage.getItem('sn_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('sn_reservations');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'res-1',
        customerName: 'Dra. Patricia Morales',
        phone: '+51 977 450 889',
        email: 'patricia.morales@gmail.com',
        date: '2026-11-14',
        time: '14:30',
        guests: 6,
        area: 'terraza',
        notes: 'Celebración de cumpleaños familiar',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      },
      {
        id: 'res-2',
        customerName: 'Jorge Palacios',
        phone: '+51 968 332 110',
        date: '2026-11-14',
        time: '19:00',
        guests: 4,
        area: 'salon',
        notes: 'Mesa cerca a la TV',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('sn_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sn_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem('sn_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sn_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('sn_tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('sn_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('sn_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // =========================================================================
  // MULTI-TAB & BROWSER REAL-TIME SYNC (BroadcastChannel & Storage Event)
  // =========================================================================
  useEffect(() => {
    if (!localSyncChannel) return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'NEW_ORDER' && data.order) {
        setOrders(prev => {
          if (prev.some(o => o.id === data.order.id)) return prev;
          return [data.order, ...prev];
        });
        playTone();
      } else if (data.type === 'UPDATE_ORDER_STATUS' && data.orderId) {
        setOrders(prev =>
          prev.map(o => (o.id === data.orderId ? { ...o, status: data.status } : o))
        );
      } else if (data.type === 'UPDATE_TABLES' && data.tables) {
        setTables(data.tables);
      }
    };

    localSyncChannel.addEventListener('message', handleMessage);

    // Also support storage event across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sn_orders' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setOrders(parsed);
        } catch (err) {}
      } else if (e.key === 'sn_tables' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setTables(parsed);
        } catch (err) {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      localSyncChannel.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // =========================================================================
  // SUPABASE REALTIME & DATA SYNC (When credentials are provided)
  // =========================================================================
  useEffect(() => {
    const client = supabase;
    if (!client || !isSupabaseConfigured()) {
      setIsLiveDatabase(false);
      return;
    }

    setIsLiveDatabase(true);

    // Initial Fetch from Supabase
    const fetchFromSupabase = async () => {
      try {
        // Fetch Menu Items
        const { data: menuData } = await client.from('menu_items').select('*');
        if (menuData && menuData.length > 0) {
          const mappedMenu: MenuItem[] = menuData.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            description: item.description,
            price: Number(item.price),
            variants: item.variants || [],
            image: item.image_url,
            isPopular: item.is_popular,
            isChefSpecial: item.is_chef_special,
            inStock: item.in_stock,
            tags: item.tags || []
          }));
          setMenu(mappedMenu);
        }

        // Fetch Tables
        const { data: tablesData } = await client.from('restaurant_tables').select('*').order('id', { ascending: true });
        if (tablesData && tablesData.length > 0) {
          const mappedTables: RestaurantTable[] = tablesData.map(t => ({
            id: t.id,
            number: t.number,
            name: t.name,
            capacity: t.capacity,
            area: t.area,
            status: t.status,
            waiter: t.waiter,
            openedAt: t.opened_at,
            totalCurrent: Number(t.total_current || 0)
          }));
          setTables(mappedTables);
        }

        // Fetch Orders
        const { data: ordersData } = await client.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersData && ordersData.length > 0) {
          const mappedOrders: Order[] = ordersData.map(o => ({
            id: o.id,
            orderNumber: o.order_number,
            type: o.type,
            customer: o.customer,
            items: o.items,
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.delivery_fee),
            discount: Number(o.discount),
            total: Number(o.total),
            paymentMethod: o.payment_method,
            status: o.status,
            waiter: o.waiter,
            createdAt: o.created_at,
            notes: o.notes
          }));
          setOrders(mappedOrders);
        }

        // Fetch Reservations
        const { data: resData } = await client.from('reservations').select('*').order('created_at', { ascending: false });
        if (resData && resData.length > 0) {
          const mappedRes: Reservation[] = resData.map(r => ({
            id: r.id,
            customerName: r.customer_name,
            phone: r.phone,
            email: r.email,
            date: r.date,
            time: r.time,
            guests: r.guests,
            area: r.area,
            status: r.status,
            notes: r.special_requests,
            createdAt: r.created_at
          }));
          setReservations(mappedRes);
        }

        // Fetch Inventory
        const { data: invData } = await client.from('inventory').select('*');
        if (invData && invData.length > 0) {
          const mappedInv: InventoryItem[] = invData.map(i => ({
            id: i.id,
            name: i.name,
            category: i.category,
            stock: Number(i.stock),
            unit: i.unit,
            minStock: Number(i.min_stock),
            lastRestocked: i.last_restocked
          }));
          setInventory(mappedInv);
        }
      } catch (err) {
        console.warn('Supabase fetch notice (running with local cache):', err);
      }
    };

    fetchFromSupabase();

    // Setup Realtime Subscriptions
    const ordersChannel = client
      .channel('realtime_orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        if (payload.eventType === 'INSERT') {
          const o = payload.new;
          const newOrder: Order = {
            id: o.id,
            orderNumber: o.order_number,
            type: o.type,
            customer: o.customer,
            items: o.items,
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.delivery_fee),
            discount: Number(o.discount),
            total: Number(o.total),
            paymentMethod: o.payment_method,
            status: o.status,
            waiter: o.waiter,
            createdAt: o.created_at,
            notes: o.notes
          };
          setOrders(prev => {
            if (prev.some(x => x.id === newOrder.id)) return prev;
            return [newOrder, ...prev];
          });
          playTone();
        } else if (payload.eventType === 'UPDATE') {
          const o = payload.new;
          setOrders(prev =>
            prev.map(item => (item.id === o.id ? { ...item, status: o.status, items: o.items || item.items } : item))
          );
        }
      })
      .subscribe();

    const tablesChannel = client
      .channel('realtime_tables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'restaurant_tables' }, payload => {
        if (payload.eventType === 'UPDATE') {
          const t = payload.new;
          setTables(prev =>
            prev.map(tab =>
              tab.id === t.id
                ? {
                    ...tab,
                    status: t.status,
                    waiter: t.waiter,
                    openedAt: t.opened_at,
                    totalCurrent: Number(t.total_current || 0)
                  }
                : tab
            )
          );
        }
      })
      .subscribe();

    return () => {
      client.removeChannel(ordersChannel);
      client.removeChannel(tablesChannel);
    };
  }, []);

  // Menu functions
  const toggleItemStock = useCallback(async (id: string) => {
    let nextStock = true;
    setMenu(prev =>
      prev.map(item => {
        if (item.id === id) {
          nextStock = !item.inStock;
          return { ...item, inStock: nextStock };
        }
        return item;
      })
    );

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      try {
        await client.from('menu_items').update({ in_stock: nextStock }).eq('id', id);
      } catch (e) {
        console.error('Supabase toggleItemStock error:', e);
      }
    }
  }, []);

  // Cart functions
  const addToCart = (
    item: MenuItem,
    variant?: { label: string; price: number },
    quantity: number = 1,
    notes?: string
  ) => {
    const unitPrice = variant ? variant.price : item.price;
    const cartItemId = `${item.id}-${variant ? variant.label : 'standard'}-${notes || ''}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(ci => ci.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * unitPrice
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem: item,
          selectedVariant: variant,
          quantity,
          notes,
          unitPrice,
          totalPrice: unitPrice * quantity
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const nextNum = orders.length + 101;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `SN-${nextNum}`,
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [newOrder, ...prev]);
    playTone();

    // Broadcast in real-time to other local tabs
    localSyncChannel?.postMessage({
      type: 'NEW_ORDER',
      order: newOrder
    });

    // Async push to Supabase if connected
    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('orders')
        .insert({
          id: newOrder.id,
          order_number: newOrder.orderNumber,
          type: newOrder.type,
          customer: newOrder.customer,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          delivery_fee: newOrder.deliveryFee,
          discount: newOrder.discount,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          status: newOrder.status,
          table_id: newOrder.customer.tableNumber ? Number(newOrder.customer.tableNumber) : null,
          waiter: newOrder.waiter,
          notes: newOrder.notes,
          created_at: newOrder.createdAt
        })
        .then(({ error }) => {
          if (error) console.error('Supabase createOrder error:', error);
        });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );

    // Broadcast to other tabs
    localSyncChannel?.postMessage({
      type: 'UPDATE_ORDER_STATUS',
      orderId,
      status
    });

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .then(({ error }) => {
          if (error) console.error('Supabase updateOrderStatus error:', error);
        });
    }
  };

  // Tables
  const updateTableStatus = (tableId: number, status: TableStatus) => {
    let updatedTables: RestaurantTable[] = [];
    setTables(prev => {
      updatedTables = prev.map(t => (t.id === tableId ? { ...t, status } : t));
      return updatedTables;
    });

    // Broadcast to other tabs
    localSyncChannel?.postMessage({
      type: 'UPDATE_TABLES',
      tables: updatedTables
    });

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('restaurant_tables')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', tableId)
        .then(({ error }) => {
          if (error) console.error('Supabase updateTableStatus error:', error);
        });
    }
  };

  const addItemsToTable = (tableId: number, items: CartItem[], waiter: string = 'Mozo') => {
    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let updatedTableData: any = null;
    let nextTables: RestaurantTable[] = [];

    setTables(prev => {
      nextTables = prev.map(table => {
        if (table.id === tableId) {
          const currentTotal = (table.totalCurrent || 0) + subtotal;
          updatedTableData = {
            status: 'occupied',
            waiter: table.waiter || waiter,
            opened_at: table.openedAt || nowTime,
            total_current: currentTotal
          };
          return {
            ...table,
            status: 'occupied',
            waiter: table.waiter || waiter,
            openedAt: table.openedAt || nowTime,
            totalCurrent: currentTotal
          };
        }
        return table;
      });
      return nextTables;
    });

    // Broadcast to other tabs
    localSyncChannel?.postMessage({
      type: 'UPDATE_TABLES',
      tables: nextTables
    });

    const client = supabase;
    if (client && isSupabaseConfigured() && updatedTableData) {
      client
        .from('restaurant_tables')
        .update(updatedTableData)
        .eq('id', tableId)
        .then(({ error }) => {
          if (error) console.error('Supabase addItemsToTable table update error:', error);
        });
    }

    // Also register comanda in orders list with waiter
    const targetTable = tables.find(t => t.id === tableId);
    createOrder({
      type: 'table',
      customer: {
        name: `Mesa ${targetTable?.number || tableId}`,
        phone: '',
        tableNumber: targetTable?.number || tableId
      },
      waiter: waiter,
      items,
      subtotal,
      deliveryFee: 0,
      discount: 0,
      total: subtotal,
      paymentMethod: 'cash',
      status: 'pending'
    });
  };

  const closeTableAccount = (tableId: number) => {
    let nextTables: RestaurantTable[] = [];
    setTables(prev => {
      nextTables = prev.map(t =>
        t.id === tableId
          ? {
              ...t,
              status: 'free',
              waiter: undefined,
              openedAt: undefined,
              totalCurrent: 0,
              activeOrder: undefined
            }
          : t
      );
      return nextTables;
    });

    // Broadcast to other tabs
    localSyncChannel?.postMessage({
      type: 'UPDATE_TABLES',
      tables: nextTables
    });

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('restaurant_tables')
        .update({
          status: 'free',
          waiter: null,
          opened_at: null,
          total_current: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', tableId)
        .then(({ error }) => {
          if (error) console.error('Supabase closeTableAccount error:', error);
        });
    }
  };

  // Reservations
  const createReservation = (reservationData: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: `res-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setReservations(prev => [newReservation, ...prev]);
    playTone();

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('reservations')
        .insert({
          id: newReservation.id,
          customer_name: newReservation.customerName,
          phone: newReservation.phone,
          email: newReservation.email,
          date: newReservation.date,
          time: newReservation.time,
          guests: newReservation.guests,
          area: newReservation.area,
          status: newReservation.status,
          special_requests: newReservation.notes,
          created_at: newReservation.createdAt
        })
        .then(({ error }) => {
          if (error) console.error('Supabase createReservation error:', error);
        });
    }
  };

  const updateReservationStatus = (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase updateReservationStatus error:', error);
        });
    }
  };

  // Inventory
  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory(prev =>
      prev.map(item => (item.id === id ? { ...item, stock: newStock } : item))
    );

    const client = supabase;
    if (client && isSupabaseConfigured()) {
      client
        .from('inventory')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase updateInventoryStock error:', error);
        });
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAdminView,
        setIsAdminView,
        adminSubView,
        setAdminSubView,
        isPOSTransitioning,
        enterPOSWithAnimation,
        finishPOSTransition,
        isLiveDatabase,
        menu,
        toggleItemStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        createOrder,
        updateOrderStatus,
        tables,
        updateTableStatus,
        addItemsToTable,
        closeTableAccount,
        reservations,
        createReservation,
        updateReservationStatus,
        inventory,
        updateInventoryStock,
        playNotificationSound: playTone
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
