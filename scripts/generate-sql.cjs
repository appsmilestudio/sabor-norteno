const fs = require('fs');
const path = require('path');

// Read menuData.ts
const menuDataPath = path.join(__dirname, '..', 'src', 'data', 'menuData.ts');
const content = fs.readFileSync(menuDataPath, 'utf8');

// Extract INITIAL_MENU, INITIAL_TABLES, INITIAL_INVENTORY
// We can use a quick regex or eval-safe parsing
const initialMenuMatch = content.match(/export const INITIAL_MENU: MenuItem\[\] = (\[[\s\S]*?\]);/);
const initialTablesMatch = content.match(/export const INITIAL_TABLES: any\[\] = (\[[\s\S]*?\]);/);
const initialInventoryMatch = content.match(/export const INITIAL_INVENTORY: any\[\] = (\[[\s\S]*?\]);/);

if (!initialMenuMatch) {
  console.error("Could not find INITIAL_MENU");
  process.exit(1);
}

// Convert typescript array string to JS object
let menuItemsStr = initialMenuMatch[1];
// Replace unquoted property names or comments if needed
// Let's use eval in an isolated function
let menuItems;
try {
  menuItems = eval(menuItemsStr);
} catch (e) {
  console.error("Eval error on menu:", e);
  process.exit(1);
}

const tables = eval(initialTablesMatch[1]);
const inventory = eval(initialInventoryMatch[1]);

let sql = `-- =========================================================================
-- ESQUEMA COMPLETO Y DATOS INICIALES PARA SABOR NORTEÑO EN SUPABASE
-- =========================================================================
-- Ejecuta este script completo en el "SQL Editor" de tu proyecto de Supabase.
-- Crea las tablas, índices, políticas de seguridad (RLS), Realtime y los 92 platos.

-- 1. TABLA: MENÚ (Platos y Bebidas)
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    variants JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_chef_special BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: MESAS DEL RESTAURANTE
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id INTEGER PRIMARY KEY,
    number INTEGER NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 4,
    area TEXT NOT NULL DEFAULT 'salon', -- salon, terraza, bar
    status TEXT NOT NULL DEFAULT 'free', -- free, occupied, bill_requested, reserved
    waiter TEXT,
    opened_at TEXT,
    total_current NUMERIC(10, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: ÓRDENES / PEDIDOS (Delivery, Recojo y Mesas - Comandas)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'delivery', -- delivery, takeout, table
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'yape', -- yape, plin, bcp, bbva, card, cash
    status TEXT NOT NULL DEFAULT 'pending', -- pending, preparing, ready, delivered, cancelled
    table_id INTEGER REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
    waiter TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: RESERVAS DE MESA
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    area TEXT NOT NULL DEFAULT 'salon',
    status TEXT NOT NULL DEFAULT 'pending', -- confirmed, pending, cancelled
    special_requests TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: INVENTARIO DE INSUMOS
CREATE TABLE IF NOT EXISTS public.inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    stock NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    unit TEXT NOT NULL,
    min_stock NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    last_restocked TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ACTIVAR REALTIME (Para que los pedidos y mesas se sincronicen en vivo)
-- =========================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;

-- =========================================================================
-- POLÍTICAS DE ACCESO (ROW LEVEL SECURITY - RLS)
-- =========================================================================
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para menú, mesas y stock
CREATE POLICY "Permitir lectura publica de menu" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Permitir modificacion de menu" ON public.menu_items FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de mesas" ON public.restaurant_tables FOR SELECT USING (true);
CREATE POLICY "Permitir modificacion de mesas" ON public.restaurant_tables FOR ALL USING (true);

CREATE POLICY "Permitir lectura y creacion de ordenes" ON public.orders FOR ALL USING (true);
CREATE POLICY "Permitir lectura y creacion de reservas" ON public.reservations FOR ALL USING (true);
CREATE POLICY "Permitir gestion de inventario" ON public.inventory FOR ALL USING (true);

-- =========================================================================
-- POBLAR DATOS INICIALES (92 PLATOS DE LA CARTA OFICIAL)
-- =========================================================================
INSERT INTO public.menu_items (id, name, category, description, price, variants, is_popular, is_chef_special, in_stock)
VALUES
`;

const menuValues = menuItems.map(item => {
  const id = `'${item.id}'`;
  const name = `'${item.name.replace(/'/g, "''")}'`;
  const category = `'${item.category}'`;
  const desc = item.description ? `'${item.description.replace(/'/g, "''")}'` : 'NULL';
  const price = item.price.toFixed(2);
  const variants = item.variants ? `'${JSON.stringify(item.variants).replace(/'/g, "''")}'::jsonb` : `'[]'::jsonb`;
  const isPop = item.isPopular ? 'true' : 'false';
  const isChef = item.isChefSpecial ? 'true' : 'false';
  const inStock = item.inStock !== false ? 'true' : 'false';
  return `(${id}, ${name}, ${category}, ${desc}, ${price}, ${variants}, ${isPop}, ${isChef}, ${inStock})`;
}).join(',\n');

sql += menuValues + `\nON CONFLICT (id) DO UPDATE SET\n  name = EXCLUDED.name,\n  category = EXCLUDED.category,\n  description = EXCLUDED.description,\n  price = EXCLUDED.price,\n  variants = EXCLUDED.variants;\n\n`;

// Populate Tables
sql += `-- POBLAR MESAS INICIALES\nINSERT INTO public.restaurant_tables (id, number, name, capacity, area, status, waiter, opened_at, total_current)\nVALUES\n`;
const tableValues = tables.map(t => {
  const waiter = t.waiter ? `'${t.waiter.replace(/'/g, "''")}'` : 'NULL';
  const openedAt = t.openedAt ? `'${t.openedAt}'` : 'NULL';
  const total = t.totalCurrent ? t.totalCurrent.toFixed(2) : '0.00';
  return `(${t.id}, ${t.number}, '${t.name}', ${t.capacity}, '${t.area}', '${t.status}', ${waiter}, ${openedAt}, ${total})`;
}).join(',\n');
sql += tableValues + `\nON CONFLICT (id) DO UPDATE SET\n  status = EXCLUDED.status,\n  waiter = EXCLUDED.waiter,\n  opened_at = EXCLUDED.opened_at,\n  total_current = EXCLUDED.total_current;\n\n`;

// Populate Inventory
sql += `-- POBLAR INVENTARIO INICIAL\nINSERT INTO public.inventory (id, name, category, stock, unit, min_stock, last_restocked)\nVALUES\n`;
const invValues = inventory.map(i => {
  return `('${i.id}', '${i.name.replace(/'/g, "''")}', '${i.category}', ${i.stock}, '${i.unit}', ${i.minStock}, '${i.lastRestocked}')`;
}).join(',\n');
sql += invValues + `\nON CONFLICT (id) DO UPDATE SET\n  stock = EXCLUDED.stock,\n  min_stock = EXCLUDED.min_stock;\n`;

const outDir = path.join(__dirname, '..', 'supabase');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
const outPath = path.join(outDir, 'schema.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Generated SQL schema with ${menuItems.length} dishes, ${tables.length} tables, and ${inventory.length} inventory items at: ${outPath}`);
