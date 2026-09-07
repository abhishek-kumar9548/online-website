import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Search, 
  Heart, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  ShieldCheck, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Package,
  Layers,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { api } from '../services/api.ts';
import { Product, Category } from '../types.ts';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate }) => {
  const { user, isAdmin, openAuthModal, logout, loginAsDemoCustomer, loginAsDemoAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories)).catch(() => {});
  }, []);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.getProducts({ search: searchQuery, limit: 5 });
        setSearchResults(res.products);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      onNavigate('shop', { search: searchQuery.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCF8]/95 backdrop-blur-md shadow-xs border-b border-[#E5E1D8]">
      {/* Top Festive Announcement Bar */}
      <div className="bg-[#8B0000] text-[#FDFCF8] py-1.5 px-4 text-[11px] font-medium text-center border-b border-[#D4AF37]/30 flex items-center justify-between tracking-wider uppercase">
        <div className="hidden md:flex items-center space-x-4 text-[11px] tracking-widest text-[#F5E6BA]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            100% Lawful & Safe Festival Merchandise
          </span>
          <span>•</span>
          <span>Handmade by Indian Artisans</span>
        </div>

        <div className="mx-auto flex items-center justify-center gap-2">
          <span>🪔</span>
          <span className="font-semibold text-white">Grand Festive Celebration:</span>
          <span className="normal-case">Use code <strong className="text-[#FFD700] tracking-wider px-1.5 py-0.5 bg-[#600000] rounded text-[11px]">FESTIVE20</strong> for 20% OFF</span>
          <span className="hidden sm:inline normal-case">• Free Delivery over ₹999</span>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[11px] text-[#F5E6BA]">
          <span className="flex items-center gap-1">
            <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
            Helpline: 1800-UTSAV-99
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-4">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo"
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-10 h-10 rounded-lg bg-[#8B0000] flex items-center justify-center shadow-xs border border-[#D4AF37]/60 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]/40" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-tighter text-[#8B0000] uppercase">
                  Utsav Veda
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F5F2EA] text-[#8B0000] font-bold tracking-widest uppercase border border-[#E5E1D8]">
                  Festive
                </span>
              </div>
              <p className="text-[10px] text-[#777777] tracking-widest uppercase font-medium">
                Sacred & Joyful Celebrations
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div ref={searchRef} className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                id="header-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim() && searchResults.length) setShowSearchDropdown(true); }}
                placeholder="Search terracotta diyas, pooja thalis, fairy lights..."
                className="w-full pl-10 pr-24 py-2 rounded-full text-[12px] bg-[#F5F2EA] border border-[#E5E1D8] text-[#333333] placeholder-[#888888] focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              />
              <Search className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                id="header-search-submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3.5 py-1 rounded-full bg-[#8B0000] text-[#FDFCF8] text-[11px] font-bold tracking-wider uppercase hover:bg-[#700000] transition-colors shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Live Search Auto-complete Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#E5E1D8] overflow-hidden z-50">
                <div className="p-2 border-b border-[#E5E1D8] bg-[#F5F2EA] flex justify-between items-center text-xs text-[#555555]">
                  <span className="font-semibold text-[11px] uppercase tracking-wider text-[#8B0000]">Matching Festive Products</span>
                  {isSearching && <span className="text-[11px] text-[#D4AF37]">Searching...</span>}
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#F0ECE1] max-h-80 overflow-y-auto">
                    {searchResults.map(prod => (
                      <div
                        key={prod.id}
                        id={`search-item-${prod.id}`}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                          onNavigate('product-detail', { productId: prod.id });
                        }}
                        className="p-3 flex items-center gap-3 hover:bg-[#F5F2EA] cursor-pointer transition-colors"
                      >
                        <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 object-cover rounded-lg border border-[#E5E1D8]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#333333] truncate">{prod.title}</p>
                          <p className="text-[12px] text-[#8B0000] font-bold mt-0.5">₹{prod.price} <span className="text-gray-400 line-through font-normal ml-1 text-[10px]">₹{prod.originalPrice}</span></p>
                        </div>
                        <span className="text-[10px] bg-[#F5F2EA] text-[#8B0000] font-semibold px-2 py-0.5 rounded-full border border-[#E5E1D8]">
                          {prod.categoryName}
                        </span>
                      </div>
                    ))}
                    <div 
                      onClick={() => {
                        setShowSearchDropdown(false);
                        onNavigate('shop', { search: searchQuery });
                      }}
                      className="p-2.5 text-center text-xs font-semibold text-[#8B0000] bg-[#F5F2EA] hover:bg-[#ECE7DA] cursor-pointer tracking-wider uppercase"
                    >
                      View all results for "{searchQuery}" →
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#666666]">
                    No festive products found matching "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-5">
            <button
              id="nav-home"
              onClick={() => onNavigate('home')}
              className={`px-2 py-1 text-[13px] font-medium tracking-wider uppercase transition-colors ${
                currentView === 'home' 
                  ? 'text-[#8B0000] border-b-2 border-[#8B0000] font-semibold' 
                  : 'text-[#333333] hover:text-[#8B0000]'
              }`}
            >
              Home
            </button>

            <button
              id="nav-shop"
              onClick={() => onNavigate('shop')}
              className={`px-2 py-1 text-[13px] font-medium tracking-wider uppercase transition-colors ${
                currentView === 'shop' 
                  ? 'text-[#8B0000] border-b-2 border-[#8B0000] font-semibold' 
                  : 'text-[#333333] hover:text-[#8B0000]'
              }`}
            >
              Shop All
            </button>

            {/* Categories Dropdown Menu */}
            <div className="relative group">
              <button
                id="nav-categories-toggle"
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                className="px-2 py-1 text-[13px] font-medium tracking-wider uppercase text-[#333333] hover:text-[#8B0000] flex items-center gap-1 transition-colors"
              >
                Categories
                <ChevronDown className="w-3.5 h-3.5 text-[#8B0000]" />
              </button>

              {categoriesDropdownOpen && (
                <div 
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-[#E5E1D8] py-2 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-4 py-2 border-b border-[#E5E1D8] text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">
                    Festive Collections
                  </div>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      id={`nav-cat-${cat.slug}`}
                      onClick={() => {
                        setCategoriesDropdownOpen(false);
                        onNavigate('shop', { categorySlug: cat.slug });
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#333333] hover:bg-[#F5F2EA] hover:text-[#8B0000] font-medium flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-[#777777] bg-[#F5F2EA] px-1.5 py-0.5 rounded-full border border-[#E5E1D8]">
                        {cat.itemCount} items
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              id="nav-about"
              onClick={() => onNavigate('about')}
              className={`px-2 py-1 text-[13px] font-medium tracking-wider uppercase transition-colors ${
                currentView === 'about' 
                  ? 'text-[#8B0000] border-b-2 border-[#8B0000] font-semibold' 
                  : 'text-[#333333] hover:text-[#8B0000]'
              }`}
            >
              About Us
            </button>

            <button
              id="nav-contact"
              onClick={() => onNavigate('contact')}
              className={`px-2 py-1 text-[13px] font-medium tracking-wider uppercase transition-colors ${
                currentView === 'contact' 
                  ? 'text-[#8B0000] border-b-2 border-[#8B0000] font-semibold' 
                  : 'text-[#333333] hover:text-[#8B0000]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Icons (Wishlist, Cart, User) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* Wishlist Button */}
            <button
              id="header-wishlist-button"
              onClick={() => onNavigate('account', { tab: 'wishlist' })}
              className="relative p-2 rounded-full text-[#333333] hover:text-[#8B0000] hover:bg-[#F5F2EA] transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#8B0000] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-button"
              onClick={() => onNavigate('cart')}
              className="relative p-2 rounded-full text-[#333333] hover:text-[#8B0000] hover:bg-[#F5F2EA] transition-colors"
              title="Shopping Bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#D4AF37] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white shadow-xs">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            <div ref={userMenuRef} className="relative">
              {user ? (
                <button
                  id="user-menu-button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-[#F5F2EA] border border-[#E5E1D8] text-[#333333] hover:border-[#D4AF37] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#8B0000] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold max-w-[90px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8B0000]" />
                </button>
              ) : (
                <button
                  id="header-login-button"
                  onClick={() => openAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8B0000] text-white text-xs font-semibold hover:bg-[#700000] transition-colors shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Login</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E5E1D8] py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-[#E5E1D8]">
                    <p className="text-xs font-semibold text-[#333333]">{user?.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-[#8B0000] text-white font-bold">
                        Administrator
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <button
                      id="menu-my-account"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account', { tab: 'profile' });
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#333333] hover:bg-[#F5F2EA] hover:text-[#8B0000] flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>

                    <button
                      id="menu-my-orders"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account', { tab: 'orders' });
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#333333] hover:bg-[#F5F2EA] hover:text-[#8B0000] flex items-center gap-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>

                    <button
                      id="menu-my-wishlist"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account', { tab: 'wishlist' });
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#333333] hover:bg-[#F5F2EA] hover:text-[#8B0000] flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>

                    {/* Admin Dashboard shortcut */}
                    {isAdmin ? (
                      <button
                        id="menu-admin-dashboard"
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold text-[#8B0000] bg-[#F5F2EA] hover:bg-[#ECE7DA] flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#8B0000]" />
                        <span>Admin Dashboard</span>
                      </button>
                    ) : (
                      <button
                        id="menu-switch-admin"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await loginAsDemoAdmin();
                          onNavigate('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-[11px] font-semibold text-[#8B0000] hover:bg-[#F5F2EA] flex items-center gap-2 border-t border-[#E5E1D8]"
                        title="Switch to Admin Demo"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8B0000]" />
                        <span>Switch to Admin View</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#E5E1D8] pt-1">
                    <button
                      id="menu-logout"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        onNavigate('home');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#333333] hover:bg-[#F5F2EA]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              id="mobile-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search festival diyas, decor, pooja items..."
              className="w-full pl-9 pr-16 py-1.5 rounded-full text-xs bg-[#F5F2EA] border border-[#E5E1D8] text-[#333333] placeholder-[#888888]"
            />
            <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold tracking-wider uppercase"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E1D8] px-4 pt-3 pb-6 space-y-2 animate-in fade-in">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('home'); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider ${currentView === 'home' ? 'text-[#8B0000] bg-[#F5F2EA]' : 'text-[#333333]'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('shop'); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider ${currentView === 'shop' ? 'text-[#8B0000] bg-[#F5F2EA]' : 'text-[#333333]'}`}
            >
              Shop All Products
            </button>
            <div className="py-1">
              <p className="px-3 text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">Categories</p>
              <div className="pl-3 mt-1 space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('shop', { categorySlug: cat.slug });
                    }}
                    className="block w-full text-left px-3 py-1.5 text-xs text-[#555555] hover:text-[#8B0000]"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('about'); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider ${currentView === 'about' ? 'text-[#8B0000] bg-[#F5F2EA]' : 'text-[#333333]'}`}
            >
              About Us
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigate('contact'); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider ${currentView === 'contact' ? 'text-[#8B0000] bg-[#F5F2EA]' : 'text-[#333333]'}`}
            >
              Contact Us
            </button>
            {isAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }}
                className="text-left px-3 py-2 rounded-lg text-xs font-bold text-[#8B0000] bg-[#F5F2EA] uppercase tracking-wider"
              >
                Admin Dashboard
              </button>
            )}
          </div>
          
          {/* Quick Demo Accounts Switcher in Mobile Drawer */}
          {!user && (
            <div className="pt-3 border-t border-[#E5E1D8] flex gap-2">
              <button
                onClick={async () => { setMobileMenuOpen(false); await loginAsDemoCustomer(); }}
                className="flex-1 py-2 text-center text-xs font-semibold bg-[#F5F2EA] text-[#8B0000] rounded-lg border border-[#E5E1D8]"
              >
                Demo Customer
              </button>
              <button
                onClick={async () => { setMobileMenuOpen(false); await loginAsDemoAdmin(); onNavigate('admin'); }}
                className="flex-1 py-2 text-center text-xs font-semibold bg-[#8B0000] text-white rounded-lg"
              >
                Demo Admin
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
