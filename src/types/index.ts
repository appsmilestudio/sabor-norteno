export interface PriceVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  variants?: PriceVariant[];
  image?: string;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  inStock: boolean;
  tags?: string[];
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  selectedVariant?: PriceVariant;
  quantity: number;
  notes?: string;
  unitPrice: number;
  totalPrice: number;
}

export type OrderType = 'delivery' | 'takeout' | 'table';
export type PaymentMethod = 'yape' | 'plin' | 'bcp' | 'bbva' | 'card' | 'cash';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  customer: {
    name: string;
    phone: string;
    address?: string;
    reference?: string;
    tableNumber?: string | number;
  };
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedTime?: string;
  notes?: string;
}

export type TableStatus = 'free' | 'occupied' | 'bill_requested' | 'reserved';

export interface RestaurantTable {
  id: number;
  number: number;
  name: string;
  capacity: number;
  area: 'salon' | 'terraza' | 'bar';
  status: TableStatus;
  activeOrder?: Order;
  waiter?: string;
  openedAt?: string;
  totalCurrent?: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  area: 'salon' | 'terraza' | 'bar';
  notes?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'pescados_mariscos' | 'carnes' | 'verduras_tuberculos' | 'bebidas' | 'insumos_cocina';
  stock: number;
  unit: string;
  minStock: number;
  lastRestocked: string;
}
