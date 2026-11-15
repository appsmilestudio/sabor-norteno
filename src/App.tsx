import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { SplashScreen } from './components/common/SplashScreen';
import { POSTransitionModal } from './components/common/POSTransitionModal';
import { Navbar } from './components/customer/Navbar';
import { Hero } from './components/customer/Hero';
import { MenuSection } from './components/customer/MenuSection';
import { CartDrawer } from './components/customer/CartDrawer';
import { CheckoutModal } from './components/customer/CheckoutModal';
import { ReservationsModal } from './components/customer/ReservationsModal';
import { RestaurantInfo } from './components/customer/RestaurantInfo';
import { Footer } from './components/customer/Footer';

// Backoffice / Admin views
import { AdminLayout } from './components/admin/AdminLayout';
import { WaiterView } from './components/admin/WaiterView';
import { POSView } from './components/admin/POSView';
import { TablesView } from './components/admin/TablesView';
import { KitchenView } from './components/admin/KitchenView';
import { OnlineOrdersView } from './components/admin/OnlineOrdersView';
import { InventoryView } from './components/admin/InventoryView';
import { ReservationsView } from './components/admin/ReservationsView';
import { ReportsView } from './components/admin/ReportsView';

export const AppContent: React.FC = () => {
  const { isAdminView, adminSubView, isPOSTransitioning, finishPOSTransition } = useApp();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);

  const scrollToMenu = () => {
    const el = document.getElementById('menu-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInfo = () => {
    const el = document.getElementById('info-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* INITIAL OPENING SPLASH ANIMATION */}
      <SplashScreen />

      {/* POS ACCESS TRANSITION ANIMATION */}
      {isPOSTransitioning && (
        <POSTransitionModal onComplete={finishPOSTransition} />
      )}

      {/* BACKOFFICE ADMIN MODE */}
      {isAdminView ? (
        <AdminLayout>
          {adminSubView === 'waiter' && <WaiterView />}
          {adminSubView === 'pos' && <POSView />}
          {adminSubView === 'tables' && <TablesView />}
          {adminSubView === 'kitchen' && <KitchenView />}
          {adminSubView === 'online_orders' && <OnlineOrdersView />}
          {adminSubView === 'inventory' && <InventoryView />}
          {adminSubView === 'reservations' && <ReservationsView />}
          {adminSubView === 'reports' && <ReportsView />}
        </AdminLayout>
      ) : (
        /* CUSTOMER PUBLIC RESTAURANT EXPERIENCE */
        <div className="min-h-screen bg-stone-50 flex flex-col">
          <Navbar
            onOpenCart={() => setIsCartOpen(true)}
            onOpenReservations={() => setIsReservationsOpen(true)}
            onScrollToMenu={scrollToMenu}
            onScrollToInfo={scrollToInfo}
          />

          <main className="flex-1">
            <Hero
              onOrderNow={scrollToMenu}
              onOpenReservations={() => setIsReservationsOpen(true)}
            />
            <MenuSection />
            <RestaurantInfo />
          </main>

          <Footer />

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onProceedToCheckout={() => setIsCheckoutOpen(true)}
          />

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />

          {/* Reservations Modal */}
          <ReservationsModal
            isOpen={isReservationsOpen}
            onClose={() => setIsReservationsOpen(false)}
          />
        </div>
      )}
    </>
  );
};
