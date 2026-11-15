-- =========================================================================
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
('ent-1', 'Tamales Verdes', 'entradas', 'Tradicional tamal verde norteño elaborado con choclo fresco y culantro.', 5.00, '[]'::jsonb, false, false, true),
('ent-2', 'Porción de Chifles Piuranos', 'entradas', 'Chifles crocantes piuranos hechos con plátano verde recién frito.', 5.00, '[]'::jsonb, true, false, true),
('ent-3', 'Tequeños Rellenos (12 und.)', 'entradas', '12 crocantes tequeños rellenos de queso y acompañados de crema de palta.', 25.00, '[]'::jsonb, false, false, true),
('ent-4', 'Patacones (12 und.)', 'entradas', '12 patacones crocantes dorados con zarza criolla.', 10.00, '[]'::jsonb, false, false, true),
('ent-5', 'Yucas Fritas', 'entradas', 'Porción de yucas doradas y suaves con crema tártara o huancaína.', 7.00, '[]'::jsonb, false, false, true),
('ent-6', 'Leche de Tigre Concentrada', 'entradas', 'Copa de leche de tigre al estilo norteño con trozos de pescado, chicharrón de pota y chifles.', 15.00, '[]'::jsonb, true, false, true),
('ent-7', 'Causa Rellena de Mariscos', 'entradas', 'Masa suave de papa amarilla con ají amarillo rellena de mariscos seleccionados.', 19.00, '[]'::jsonb, false, false, true),
('ent-8', 'Canastitas Acevichadas (12 und.)', 'entradas', '12 canastitas crocantes rellenas de ceviche fresco con toque especial acevichado.', 25.00, '[]'::jsonb, false, true, true),
('cev-1', 'Ceviche de Filete', 'ceviches', 'Pescado fresco del día curtido en limón norteño, cebolla roja, ají limo, camote y chifles.', 35.00, '[{"label":"Personal","price":35},{"label":"Fuente Familiar","price":45}]'::jsonb, true, false, true),
('cev-2', 'Ceviche de Caballa', 'ceviches', 'Clásico ceviche piurano de caballa fresca con sarandaja, choclo y chifles.', 30.00, '[{"label":"Personal","price":30},{"label":"Fuente Familiar","price":35}]'::jsonb, true, false, true),
('cev-3', 'Ceviche Mixto (Caballa + Filete)', 'ceviches', 'La combinación perfecta norteña: caballa tierna con filete fresco en jugo de limón.', 40.00, '[]'::jsonb, false, false, true),
('cev-4', 'Ceviche Mixto (Filete + Mariscos)', 'ceviches', 'Filete de pescado fresco acompañado de pulpo, calamar, langostinos y conchas.', 40.00, '[]'::jsonb, true, false, true),
('cev-5', 'Ceviche de Conchas Negras y Filete', 'ceviches', 'Conchas negras de Tumbes combinadas con filete de pescado en su leche de tigre negra.', 30.00, '[{"label":"Personal","price":30},{"label":"Fuente Especial","price":40}]'::jsonb, false, true, true),
('cev-6', 'Ceviche de Conchas Negras Puro', 'ceviches', 'Auténticas conchas negras frescas preparadas al momento con sazón norteña.', 25.00, '[]'::jsonb, false, false, true),
('cev-7', 'Ceviche "Sabor Norteño" (Especial de la Casa)', 'ceviches', 'Nuestra receta secreta con pesca seleccionada, mariscos salteados y crema de ají norteño.', 35.00, '[]'::jsonb, true, true, true),
('cau-1', 'Causa Acevichada', 'causas', 'Causa limeña de papa amarilla coronada con ceviche de pescado fresco al toque acevichado.', 25.00, '[]'::jsonb, true, false, true),
('cau-2', 'Causa con Lomo al Jugo', 'causas', 'Fusión criolla: causa suave de papa amarilla cubierta con jugoso lomo saltado al wok.', 28.00, '[]'::jsonb, false, false, true),
('cau-3', 'Causa Sabor Norteño', 'causas', 'Causa especial con pulpa de cangrejo, langostinos y palta con salsa golf de la casa.', 25.00, '[]'::jsonb, false, false, true),
('cau-4', 'Trío de Causas Especial', 'causas', 'Trilogía gastronómica: Causa de pulpo al olivo + Causa acevichada + Causa con langostino al panko.', 30.00, '[]'::jsonb, false, true, true),
('piq-1', 'Majado de Yuca Típico', 'piqueos', 'Yuca norteña majada en aderezo tradicional piurano con chicharrón crocante y zarza criolla.', 35.00, '[]'::jsonb, true, false, true),
('piq-2', 'Seco de Chavelo', 'piqueos', 'Plátano verde frito y majado con carne aliñada macerada, culantro y zarza criolla.', 35.00, '[]'::jsonb, true, true, true),
('piq-3', 'Majado de Yuca con Costillas', 'piqueos', 'Majado de yuca criollo acompañado de jugosas costillas de cerdo doradas.', 40.00, '[]'::jsonb, false, false, true),
('piq-4', 'Carne Aliñada con Patacones', 'piqueos', 'Auténtica carne de cerdo aliñada al sol con especias piuranas y patacones crocantes.', 40.00, '[]'::jsonb, true, false, true),
('piq-5', 'Costillas de Chancho con Patacones', 'piqueos', 'Costillas doradas crocantes por fuera y suaves por dentro con patacones.', 40.00, '[]'::jsonb, false, false, true),
('piq-6', 'Cachema Encebollada', 'piqueos', 'Pescado entero de cachema frita bañada en encebollado criollo con tomate y ají.', 30.00, '[]'::jsonb, false, false, true),
('piq-7', 'Jalea Mixta Marina', 'piqueos', 'Trozos de pescado y mixtura de mariscos crocantes dorados, con yucas fritas y zarza criolla.', 40.00, '[]'::jsonb, true, false, true),
('piq-8', 'Jalea en Salsa de Mariscos', 'piqueos', 'Crocante jalea de pescado bañada en concentrada y cremosa salsa madre de mariscos.', 45.00, '[]'::jsonb, false, true, true),
('piq-9', 'Costillas de Chancho a la BBQ', 'piqueos', 'Costillitas glaseadas en abundante salsa barbacoa ahumada con papas o patacones.', 40.00, '[]'::jsonb, false, false, true),
('piq-10', 'Pulpo al Olivo', 'piqueos', 'Láminas tiernas de pulpo marinadas en suave crema de aceitunas botija y galletas.', 25.00, '[]'::jsonb, false, false, true),
('chi-1', 'Chicharrón de Pescado', 'chicharrones', 'Trozos de filete de pescado fresco empanizados y fritos al punto con yucas y tártara.', 25.00, '[{"label":"Chico","price":25},{"label":"Mediano","price":35},{"label":"Fuente Grande","price":45}]'::jsonb, true, false, true),
('chi-2', 'Chicharrón de Pollo y Pescado', 'chicharrones', 'Combinación mixta de pollo y pescado crocante.', 30.00, '[{"label":"Personal","price":30},{"label":"Familiar","price":40}]'::jsonb, false, false, true),
('chi-3', 'Chicharrón de Pollo', 'chicharrones', 'Crocantes trozos de pechuga sazonada con papas fritas y cremas.', 30.00, '[{"label":"Personal","price":30},{"label":"Familiar","price":40}]'::jsonb, false, false, true),
('chi-4', 'Chicharrón de Pota', 'chicharrones', 'Anillos de pota crocantes con yucas fritas y zarza de cebolla.', 20.00, '[{"label":"Personal","price":20},{"label":"Familiar","price":30}]'::jsonb, false, false, true),
('chi-5', 'Chicharrón Mixto Especial', 'chicharrones', 'Pescado, pulpo, calamar y langostinos crocantes.', 30.00, '[{"label":"Personal","price":30},{"label":"Familiar","price":40}]'::jsonb, true, false, true),
('arr-1', 'Arroz con Mariscos', 'arroces', 'Arroz criollo sazonado con ají amarillo, pisco, coral y mixtura de mariscos frescos.', 25.00, '[{"label":"Chico","price":25},{"label":"Mediano","price":35},{"label":"Familiar","price":45}]'::jsonb, true, false, true),
('arr-2', 'Arroz con Langostinos', 'arroces', 'Arroz salteado al pisco y ají panca con abundantes colas de langostinos tiernos.', 30.00, '[{"label":"Personal","price":30},{"label":"Familiar","price":40}]'::jsonb, false, false, true),
('arr-3', 'Arroz Chaufa Marino / Mixto', 'arroces', 'Arroz frito al wok con cebolla china, salsa de soya y frutos del mar o pollo.', 15.00, '[{"label":"Personal","price":15},{"label":"Familiar","price":25}]'::jsonb, false, false, true),
('tac-1', 'Tacu Tacu a lo Pobre', 'arroces', 'Mezcla dorada de frijoles y arroz a la sartén con bistec, huevo y plátano frito.', 35.00, '[]'::jsonb, false, false, true),
('tac-2', 'Tacu Tacu con Lomo al Jugo', 'arroces', 'Torta de tacu tacu dorada servida con abundante lomo saltado con tomates y cebolla.', 33.00, '[]'::jsonb, false, false, true),
('tac-3', 'Tacu Tacu en Salsa de Mariscos', 'arroces', 'Tacu tacu crocante cubierto con salsa cremosa de mariscos flameados al vino.', 35.00, '[]'::jsonb, true, false, true),
('ali-1', 'Alitas Sabor Norteño (6 und.)', 'alitas', '6 alitas a elección (Acevichada, Maracuyá, Broaster, BBQ o Búfalo) con papas fritas y ensalada.', 20.00, '[]'::jsonb, false, false, true),
('ali-2', 'Alitas Sabor Norteño (9 und.)', 'alitas', '9 alitas crocantes con salsa a elección, papas fritas crocantes y ensalada fresca.', 27.00, '[]'::jsonb, false, false, true),
('ali-3', 'Alitas Sabor Norteño (12 und.)', 'alitas', '12 alitas para compartir con papas y cremas de la casa.', 34.00, '[]'::jsonb, false, false, true),
('ali-4', 'Ronda de Alitas de la Casa', 'alitas', 'Festival de sabores: BBQ + Acevichada + Búfalo + Salsa de Maracuyá con abundantes papas.', 48.00, '[]'::jsonb, true, true, true),
('ron-1', 'Ronda Criolla Tradicional', 'rondas', 'Seco de chavelo + Majado de yuca + Carne aliñada + Chifles + Palta + Zarza criolla.', 35.00, '[]'::jsonb, true, false, true),
('ron-2', 'Ronda Criolla Familiar con Costillas', 'rondas', 'Seco de chavelo + Majado de yuca + Carne aliñada + Chifles + Palta + Costillas de cerdo.', 65.00, '[]'::jsonb, false, true, true),
('ron-3', 'Ronda Marina', 'rondas', 'Arroz con mariscos + Majarisco + Ceviche de pescado + Causa rellena de mariscos + Chicharrón de pescado.', 65.00, '[]'::jsonb, true, true, true),
('ron-4', 'Ronda Criolla al Estilo "Sabor Norteño"', 'rondas', 'Seco de chavelo + Majado de yuca + Carne aliñada + Costillas de cerdo + Arroz con mariscos.', 70.00, '[]'::jsonb, true, true, true),
('ron-5', 'Ronda Cevichera Marina', 'rondas', 'Ceviche de filete + Ceviche de caballa + Ceviche mixto + Ceviche de conchas negras + Cocktail de langostinos.', 60.00, '[]'::jsonb, true, true, true),
('sud-1', 'Sudado de Cabrillón', 'sudados', 'Fino cabrillón entero en caldo concentrado con chicha de jora, tomate, cebolla y yuca.', 60.00, '[]'::jsonb, false, true, true),
('sud-2', 'Sudado de Caballa', 'sudados', 'Clásico sudado norteño con caballa fresca, chicha y ají amarillo con arroz y yuca.', 30.00, '[]'::jsonb, false, false, true),
('sud-3', 'Sudado de Cabrilla', 'sudados', 'Cabrilla fresca sudada a fuego lento con especias del norte.', 35.00, '[]'::jsonb, false, false, true),
('sud-4', 'Parihuela Mixta Marina', 'sudados', 'Poderoso caldo levantamuertos con pescado entero, cangrejo, conchas y mariscos.', 50.00, '[]'::jsonb, true, false, true),
('pas-1', 'Pasado de Cabrillón', 'sudados', 'Plato ancestral piurano de cabrillón al vapor aromatizado con cebolla, ají y culantro.', 60.00, '[]'::jsonb, false, false, true),
('pas-2', 'Pasado de Caballa', 'sudados', 'Pasado norteño de caballa fresca con sarandaja, camote y choclo.', 40.00, '[]'::jsonb, false, false, true),
('pas-3', 'Pasado de Cabrilla', 'sudados', 'Cabrilla pasada al vapor con sazón norteña.', 30.00, '[{"label":"Personal","price":30},{"label":"Familiar","price":40}]'::jsonb, false, false, true),
('pas-4', 'Cachemas Encebolladas en Fuente', 'sudados', 'Frescas cachemas pasadas y bañadas en abundante salsa criolla de cebolla y ají.', 35.00, '[]'::jsonb, false, false, true),
('chu-1', 'Chupe de Pescado', 'sudados', 'Caldo cremoso con pescado, leche, queso fresco, huevo escalfado, choclo y huacatay.', 30.00, '[]'::jsonb, false, false, true),
('chu-2', 'Chupe de Cangrejo', 'sudados', 'Sopa espesa y reconstituyente a base de cangrejos enteros con su jugo y especias.', 35.00, '[]'::jsonb, false, false, true),
('chu-3', 'Chupe de Mariscos', 'sudados', 'Chupe sustancioso con mixtura marina, langostinos y queso fresco.', 35.00, '[]'::jsonb, true, false, true),
('alm-1', 'Lomito Saltado Criollo', 'almuerzos', 'Tiras de lomo salteadas al wok con cebolla, tomate, ají amarillo, papas fritas y arroz.', 20.00, '[]'::jsonb, true, false, true),
('alm-2', 'Lomo a lo Pobre', 'almuerzos', 'Generoso lomo con papas fritas, arroz, huevo frito y plátano de la seda dorado.', 23.00, '[]'::jsonb, true, false, true),
('alm-3', 'Apanado de Res con Arroz y Papas', 'almuerzos', 'Filete de res empanizado crocante acompañado de arroz graneado y papas doradas.', 18.00, '[]'::jsonb, false, false, true),
('alm-4', 'Bistec con Arroz y Menestra', 'almuerzos', 'Bistec a la plancha servido con menestra norteña casera, arroz y zarza criolla.', 20.00, '[]'::jsonb, false, false, true),
('alm-5', 'Bistec a lo Pobre', 'almuerzos', 'Bistec a la plancha con huevo frito, plátano frito, arroz y papas fritas.', 23.00, '[]'::jsonb, false, false, true),
('alm-6', 'Pollo Saltado con Papas', 'almuerzos', 'Trozos de pechuga de pollo salteados al wok con verduras y papas crujientes.', 17.00, '[]'::jsonb, false, false, true),
('alm-7', 'Pollo a la Plancha con Ensalada', 'almuerzos', 'Filete de pechuga jugosa a la plancha acompañada de arroz y ensalada fresca.', 17.00, '[]'::jsonb, false, false, true),
('alm-8', 'Apanado de Pollo con Arroz y Papas', 'almuerzos', 'Milanesa suave de pollo con papas fritas y arroz.', 15.00, '[]'::jsonb, false, false, true),
('alm-9', 'Apanado de Pescado con Arroz y Menestra', 'almuerzos', 'Filete de pescado empanizado con menestra casera y arroz.', 18.00, '[]'::jsonb, false, false, true),
('alm-10', 'Cachema Encebollada con Arroz y Menestra', 'almuerzos', 'Plato típico con pescado cachema frita, encebollado jugoso y menestra del día.', 15.00, '[]'::jsonb, false, false, true),
('alm-11', 'Milanesa de Pollo Especial', 'almuerzos', 'Milanesa dorada extra grande con arroz, papas fritas y ensalada.', 22.00, '[]'::jsonb, false, false, true),
('alm-12', 'Pollo Broaster con Papas y Ensalada', 'almuerzos', 'Crocante pollo broaster estilo norteño con papas fritas y cremas.', 15.00, '[]'::jsonb, false, false, true),
('tri-1', 'Trío Marino Sabor Norteño', 'combos', 'Ceviche de pescado fresco + Arroz con mariscos calientito + Chicharrón de pescado crocante.', 40.00, '[]'::jsonb, true, true, true),
('com-1', 'Combo Ceviche + Chicharrón de Pescado', 'combos', 'Dúo clásico marino: plato de ceviche de pescado con chicharrón crocante y chifles.', 30.00, '[]'::jsonb, true, false, true),
('com-2', 'Combo Ceviche + Arroz con Mariscos', 'combos', 'La combinación favorita: ceviche fresco con arroz con mariscos al toque criollo.', 30.00, '[]'::jsonb, true, false, true),
('com-3', 'Combo Arroz con Mariscos + Chicharrón', 'combos', 'Arroz con mariscos jugoso con chicharrón de pescado dorado.', 30.00, '[]'::jsonb, false, false, true),
('com-4', 'Combo Causa Rellena de Mariscos + Ceviche', 'combos', 'Causa rellena de frutos del mar con porción de ceviche de pescado al limón norteño.', 30.00, '[]'::jsonb, false, false, true),
('beb-1', 'Jarra de Chicha Morada Casera (1L)', 'bebidas', 'Preparada con maíz morado, piña, manzana, canela y clavo de olor bien helada.', 15.00, '[]'::jsonb, true, false, true),
('beb-2', 'Jarra de Maracuyá Natural (1L)', 'bebidas', 'Refrescante maracuyá norteña natural helada.', 18.00, '[]'::jsonb, true, false, true),
('beb-3', 'Jarra de Maracumango (1L)', 'bebidas', 'Exquisita fusión de maracuyá y mango ciruelo de Piura.', 18.00, '[]'::jsonb, false, true, true),
('beb-4', 'Jarra de Jugo de Mango Natural (1L)', 'bebidas', 'Elaborado con los mejores mangos piuranos dulces y frescos.', 18.00, '[]'::jsonb, false, false, true),
('beb-5', 'Limonada Clásica', 'bebidas', 'Limonada refrescante con limón sutil piurano.', 10.00, '[]'::jsonb, false, false, true),
('beb-6', 'Limonada Frozen Granizada', 'bebidas', 'Limonada granizada con toque de menta helada.', 14.00, '[]'::jsonb, false, false, true),
('beb-7', 'Gaseosa Inka Kola / Coca Cola 1L', 'bebidas', 'Botella de 1 Litro bien helada.', 8.00, '[]'::jsonb, false, false, true),
('beb-8', 'Gaseosa Inka Kola / Coca Cola 1.5L', 'bebidas', 'Botella de 1.5 Litros bien helada.', 10.00, '[]'::jsonb, false, false, true),
('beb-9', 'Gaseosa Inka Kola / Coca Cola 2L', 'bebidas', 'Botella de 2 Litros familiar bien helada.', 12.00, '[]'::jsonb, false, false, true),
('beb-10', 'Gaseosa Gordita Vidrio', 'bebidas', 'Gaseosa gordita clásica helada.', 5.00, '[]'::jsonb, false, false, true),
('beb-11', 'Gaseosa Personal 500ml', 'bebidas', 'Inka Kola o Coca Cola de 500ml.', 4.00, '[]'::jsonb, false, false, true),
('beb-12', 'Gaseosa Chiquita 296ml', 'bebidas', 'Botellita de 296ml.', 3.00, '[]'::jsonb, false, false, true),
('cer-1', 'Cerveza Cristal Helada', 'bebidas', 'Botella 650ml servida al polo.', 10.00, '[]'::jsonb, false, false, true),
('cer-2', 'Cerveza Pilsen Callao Helada', 'bebidas', 'Botella 630ml bien al polo.', 11.00, '[]'::jsonb, true, false, true),
('cer-3', 'Cerveza Cusqueña (Trigo / Negra)', 'bebidas', 'Botella helada de cerveza Cusqueña premium.', 12.00, '[]'::jsonb, true, false, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  variants = EXCLUDED.variants;

-- POBLAR MESAS INICIALES
INSERT INTO public.restaurant_tables (id, number, name, capacity, area, status, waiter, opened_at, total_current)
VALUES
(1, 1, 'Mesa 1', 4, 'salon', 'occupied', 'Carlos M.', '13:40', 75.00),
(2, 2, 'Mesa 2', 2, 'salon', 'free', NULL, NULL, 0.00),
(3, 3, 'Mesa 3', 6, 'salon', 'bill_requested', 'Rosa P.', '12:55', 145.00),
(4, 4, 'Mesa 4', 4, 'salon', 'free', NULL, NULL, 0.00),
(5, 5, 'Mesa 5', 4, 'terraza', 'reserved', 'Carlos M.', '14:30', 0.00),
(6, 6, 'Mesa 6', 6, 'terraza', 'free', NULL, NULL, 0.00),
(7, 7, 'Mesa 7', 8, 'terraza', 'occupied', 'Rosa P.', '13:15', 210.00),
(8, 8, 'Bar 1', 2, 'bar', 'free', NULL, NULL, 0.00),
(9, 9, 'Bar 2', 2, 'bar', 'occupied', 'Juan C.', '14:05', 35.00),
(10, 10, 'Bar 3', 2, 'bar', 'free', NULL, NULL, 0.00)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  waiter = EXCLUDED.waiter,
  opened_at = EXCLUDED.opened_at,
  total_current = EXCLUDED.total_current;

-- POBLAR INVENTARIO INICIAL
INSERT INTO public.inventory (id, name, category, stock, unit, min_stock, last_restocked)
VALUES
('inv-1', 'Filete de Pescado Fresco', 'pescados_mariscos', 18.5, 'kg', 5, '2026-11-14'),
('inv-2', 'Caballa Fresca', 'pescados_mariscos', 12, 'kg', 4, '2026-11-14'),
('inv-3', 'Conchas Negras', 'pescados_mariscos', 120, 'und', 40, '2026-11-14'),
('inv-4', 'Mixtura de Mariscos', 'pescados_mariscos', 8.5, 'kg', 3, '2026-11-14'),
('inv-5', 'Carne de Cerdo Aliñada', 'carnes', 14, 'kg', 4, '2026-11-13'),
('inv-6', 'Lomo Fino de Res', 'carnes', 7.2, 'kg', 3, '2026-11-14'),
('inv-7', 'Plátano Verde (Bellaco para Chifles y Chavelo)', 'verduras_tuberculos', 45, 'racimos', 10, '2026-11-13'),
('inv-8', 'Yuca Piurana Seleccionada', 'verduras_tuberculos', 35, 'kg', 10, '2026-11-14'),
('inv-9', 'Limón Sutil Norteño', 'verduras_tuberculos', 28, 'kg', 8, '2026-11-14'),
('inv-10', 'Cerveza Pilsen 630ml', 'bebidas', 48, 'botellas', 24, '2026-11-12'),
('inv-11', 'Cerveza Cusqueña Trigo', 'bebidas', 36, 'botellas', 18, '2026-11-12'),
('inv-12', 'Inka Kola 1.5L', 'bebidas', 22, 'botellas', 10, '2026-11-13')
ON CONFLICT (id) DO UPDATE SET
  stock = EXCLUDED.stock,
  min_stock = EXCLUDED.min_stock;
