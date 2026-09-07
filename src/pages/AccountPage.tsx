import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Package, 
  Heart, 
  MapPin, 
  Settings, 
  LogOut, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  ShoppingBag,
  Trash2,
  Lock,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { Order, Product } from '../types.ts';
import { api } from '../services/api.ts';

interface AccountPageProps {
  initialTab?: string;
  onNavigate: (view: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ 
  initialTab = 'orders', 
  onNavigate,
  onQuickView
}) => {
  const { user, token, logout, openAuthModal } = useAuth();
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'security'>(
    (initialTab as any) || 'orders'
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Sync tab if passed via props
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Load orders
  useEffect(() => {
    if (user && token) {
      setLoadingOrders(true);
      api.getOrders().then(res => {
        setOrders(res.orders);
      }).catch(err => console.error(err)).finally(() => setLoadingOrders(false));
    }
  }, [user, token]);

  // Load wishlist items
  useEffect(() => {
    if (wishlistIds.length > 0) {
      setLoadingWishlist(true);
      api.getProducts({ limit: 50 }).then(res => {
        const favorited = res.products.filter(p => wishlistIds.includes(p.id));
        setWishlistProducts(favorited);
      }).catch(err => console.error(err)).finally(() => setLoadingWishlist(false));
    } else {
      setWishlistProducts([]);
    }
  }, [wishlistIds]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-lg border border-[#E5E1D8] text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-[#FDFCF8] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#8B0000]">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#333333]">Account Sign In Required</h2>
        <p className="text-xs text-[#666666]">
          Please sign in to view your order history, manage addresses, or access your saved festival wishlist.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold transition-colors shadow-2xs"
        >
          Sign In to Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Account Header */}
      <div className="bg-[#FDFCF8] p-6 sm:p-8 rounded-lg border border-[#E5E1D8] mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-md bg-[#8B0000] text-white flex items-center justify-center text-xl font-bold font-serif shadow-2xs border border-[#D4AF37]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#333333]">{user.name}</h1>
            <p className="text-xs text-[#666666]">{user.email} • {user.phone || 'Phone not set'}</p>
            {user.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-0.5 rounded-sm bg-[#8B0000] text-[#FFDF88] text-[10px] font-bold tracking-wider uppercase">
                👑 Store Administrator
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-2 rounded-md bg-[#8B0000] text-[#FFF9EE] text-xs font-bold hover:bg-[#700000] transition-colors shadow-2xs"
            >
              Open Admin Dashboard
            </button>
          )}
          <button
            onClick={() => { logout(); onNavigate('home'); }}
            className="px-4 py-2 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold text-rose-700 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs + Active View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Tabs (Left Sidebar) */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-lg border border-[#E5E1D8] p-3 shadow-2xs space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3 rounded-md text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'orders' ? 'bg-[#8B0000] text-white' : 'text-[#555555] hover:bg-[#FDFCF8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Festive Orders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-sm ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#FDFCF8] border border-[#D4AF37]/40 text-[#8B0000]'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-4 py-3 rounded-md text-xs font-bold flex items-center justify-between transition-colors ${
                activeTab === 'wishlist' ? 'bg-[#8B0000] text-white' : 'text-[#555555] hover:bg-[#FDFCF8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Saved Wishlist</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-sm ${
                activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-[#FDFCF8] border border-[#D4AF37]/40 text-[#8B0000]'
              }`}>
                {wishlistIds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3 rounded-md text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'addresses' ? 'bg-[#8B0000] text-white' : 'text-[#555555] hover:bg-[#FDFCF8]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Delivery Addresses</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left px-4 py-3 rounded-md text-xs font-bold flex items-center gap-2.5 transition-colors ${
                activeTab === 'security' ? 'bg-[#8B0000] text-white' : 'text-[#555555] hover:bg-[#FDFCF8]'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </div>
        </aside>

        {/* Tab Content (Right) */}
        <main className="lg:col-span-9">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#333333]">Recent Festive Orders</h2>
              
              {loadingOrders ? (
                <div className="space-y-3">
                  {[1, 2].map(i => <div key={i} className="h-40 bg-white rounded-lg animate-pulse border border-[#E5E1D8]" />)}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-lg border border-[#E5E1D8] p-5 sm:p-6 shadow-2xs space-y-4">
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E1D8] pb-3 text-xs">
                        <div>
                          <span className="text-[11px] text-[#777777]">Order ID:</span>
                          <span className="font-bold text-[#8B0000] ml-1.5">{order.orderNumber}</span>
                          <span className="text-[11px] text-[#777777] ml-3">
                            Placed: {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const status = order.orderStatus || (order as any).status || 'pending';
                            return (
                              <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                                status === 'delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : status === 'shipped' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {status === 'delivered' ? '✓ Delivered' : status === 'shipped' ? '🚚 In Transit' : '⏱ ' + status}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-xs">
                            <img src={item.image} alt="" className="w-14 h-14 rounded-md object-cover border border-[#E5E1D8]" />
                            <div className="flex-1">
                              <h4 className="font-bold text-[#333333]">{item.title}</h4>
                              <p className="text-[11px] text-[#777777]">Qty: {item.quantity} {item.variant && `• Option: ${item.variant}`}</p>
                            </div>
                            <span className="font-bold text-[#8B0000]">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer & Tracking */}
                      <div className="pt-3 border-t border-[#E5E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-[#666666]">
                          <span>Estimated Delivery: <strong>{order.estimatedDelivery}</strong></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-[#333333]">Total: ₹{order.total}</span>
                          <button
                            onClick={() => window.print()}
                            className="px-3 py-1.5 rounded-md border border-[#E5E1D8] text-[11px] font-bold text-[#555555] hover:bg-[#FDFCF8]"
                          >
                            Print Receipt
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-10 text-center border border-[#E5E1D8] space-y-3 shadow-2xs">
                  <Package className="w-10 h-10 text-[#777777] mx-auto" />
                  <p className="text-xs text-[#666666]">You haven't placed any festive orders yet.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000]"
                  >
                    Start Festive Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h2 className="font-serif text-lg font-bold text-[#333333]">Your Festive Wishlist</h2>
              
              {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-lg border border-[#E5E1D8] p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="aspect-square rounded-md overflow-hidden mb-3 bg-[#FDFCF8] border border-[#E5E1D8]">
                          <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#8B0000] uppercase">{product.categoryName}</span>
                        <h4 className="font-serif font-bold text-xs text-[#333333] line-clamp-1 mt-0.5">{product.title}</h4>
                        <p className="font-bold text-sm text-[#8B0000] mt-1">₹{product.price}</p>
                      </div>

                      <div className="pt-3 border-t border-[#E5E1D8] flex items-center gap-2 mt-3">
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            removeFromWishlist(product.id);
                          }}
                          className="flex-1 py-2 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000] flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-2 rounded-md border border-[#E5E1D8] text-rose-600 hover:bg-rose-50"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-10 text-center border border-[#E5E1D8] space-y-3 shadow-2xs">
                  <Heart className="w-10 h-10 text-rose-400 mx-auto" />
                  <p className="text-xs text-[#666666]">Your wishlist is currently empty.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000]"
                  >
                    Browse Handcrafted Treasures
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#333333]">Saved Delivery Addresses</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(user.addresses || []).map((addr, idx) => (
                  <div key={idx} className="bg-white rounded-lg border border-[#E5E1D8] p-5 shadow-2xs space-y-2 relative">
                    {addr.isDefault && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold text-[#8B0000] bg-[#FDFCF8] px-2 py-0.5 rounded-sm border border-[#D4AF37]/40">
                        Default Address
                      </span>
                    )}
                    <h4 className="font-bold text-xs text-[#333333]">{addr.fullName}</h4>
                    <p className="text-xs text-[#555555]">{addr.street}</p>
                    <p className="text-xs text-[#555555]">{addr.city}, {addr.state} - {addr.pincode}</p>
                    <p className="text-[11px] text-[#777777]">Mobile: {addr.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 sm:p-8 shadow-2xs max-w-xl space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#333333]">Security Settings</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 rounded-md bg-gray-100 text-gray-500 border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#333333] mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password (min 6 chars)"
                    className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => alert('Password updated successfully!')}
                  className="px-5 py-2.5 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000]"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
