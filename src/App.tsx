import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { QuickViewModal } from './components/QuickViewModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Product } from './types.ts';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { AccountPage } from './pages/AccountPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';

function MainApp() {
  // Navigation Routing State
  const [currentView, setCurrentView] = useState<string>('home');
  const [routeData, setRouteData] = useState<Record<string, any>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Initialize from location pathname & query params
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.replace(/^\/+/, '');
      const searchParams = new URLSearchParams(window.location.search);

      if (path === '' || path === 'home') {
        setCurrentView('home');
      } else if (path === 'shop') {
        setCurrentView('shop');
        setRouteData({
          categorySlug: searchParams.get('category') || '',
          search: searchParams.get('q') || ''
        });
      } else if (path.startsWith('product/')) {
        const prodId = path.replace('product/', '');
        setCurrentView('product-detail');
        setRouteData({ productId: prodId });
      } else if (path === 'cart') {
        setCurrentView('cart');
      } else if (path === 'checkout') {
        setCurrentView('checkout');
      } else if (path === 'account') {
        setCurrentView('account');
        setRouteData({ tab: searchParams.get('tab') || 'orders' });
      } else if (path === 'about') {
        setCurrentView('about');
      } else if (path === 'contact') {
        setCurrentView('contact');
      } else if (path === 'admin') {
        setCurrentView('admin');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const navigate = (view: string, data: Record<string, any> = {}) => {
    setCurrentView(view);
    setRouteData(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser URL history without reload
    let url = '/';
    if (view === 'home') url = '/';
    else if (view === 'shop') {
      const params = new URLSearchParams();
      if (data.categorySlug) params.set('category', data.categorySlug);
      if (data.search) params.set('q', data.search);
      url = `/shop${params.toString() ? '?' + params.toString() : ''}`;
    } else if (view === 'product-detail' && data.productId) {
      url = `/product/${data.productId}`;
    } else if (view === 'account') {
      url = `/account${data.tab ? '?tab=' + data.tab : ''}`;
    } else {
      url = `/${view}`;
    }

    try {
      window.history.pushState({}, '', url);
    } catch {
      // In sandboxed iframes pushState might be restricted
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF8] text-[#333333] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#8B0000]">
      {/* Header */}
      <Header onNavigate={navigate} currentView={currentView} />

      {/* Main Routed Page Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage 
            onNavigate={navigate} 
            onQuickView={(p) => setQuickViewProduct(p)} 
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            initialCategorySlug={routeData.categorySlug}
            initialSearch={routeData.search}
            onSelectProduct={(id) => navigate('product-detail', { productId: id })}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailPage
            productId={routeData.productId || 'prod-1'}
            onNavigate={navigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentView === 'cart' && (
          <CartPage onNavigate={navigate} />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage onNavigate={navigate} />
        )}

        {currentView === 'account' && (
          <AccountPage
            initialTab={routeData.tab}
            onNavigate={navigate}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        )}

        {currentView === 'about' && (
          <AboutPage onNavigate={navigate} />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {currentView === 'admin' && (
          <AdminPage onNavigate={navigate} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onViewFullDetail={(id) => {
          setQuickViewProduct(null);
          navigate('product-detail', { productId: id });
        }}
      />

      {/* Global Authentication Modal */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
