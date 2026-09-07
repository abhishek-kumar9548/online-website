import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  Search,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { Product, Order, Category } from '../types.ts';
import { api } from '../services/api.ts';

interface AdminPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const { user, token, loginAsDemoAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState(499);
  const [newOriginalPrice, setNewOriginalPrice] = useState(799);
  const [newCategory, setNewCategory] = useState('cat-2');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1605335198031-6e3e57f2ca29?auto=format&fit=crop&w=800&q=80');
  const [newStock, setNewStock] = useState(45);
  const [newShortDesc, setNewShortDesc] = useState('');

  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordRes, prodRes, catRes] = await Promise.all([
        api.getAdminOrders(),
        api.getProducts({ limit: 100 }),
        api.getCategories()
      ]);
      setOrders(ordRes.orders);
      setProducts(prodRes.products);
      setCategories(catRes.categories);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' && token) {
      loadAdminData();
    }
  }, [user, token]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-lg border border-[#E5E1D8] text-center space-y-4 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-[#FDFCF8] border border-[#D4AF37]/50 flex items-center justify-center mx-auto text-[#8B0000]">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#333333]">Administrator Access Only</h2>
        <p className="text-xs text-[#666666]">
          This control panel allows store managers to oversee real-time festive orders, manage inventory, and adjust pricing.
        </p>
        <div className="pt-2">
          <button
            onClick={loginAsDemoAdmin}
            className="w-full py-3 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold transition-colors shadow-2xs"
          >
            👑 Log In Instantly as Demo Admin
          </button>
        </div>
      </div>
    );
  }

  // KPIs
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const pendingOrdersCount = orders.filter(o => {
    const st = o.orderStatus || (o as any).status;
    return st === 'pending' || st === 'processing';
  }).length;
  const inStockProductsCount = products.filter(p => p.inStock).length;

  const handleUpdateOrderStatus = async (orderId: string, status: any) => {
    if (!token) return;
    try {
      await api.updateOrderStatus(orderId, status);
      setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: status, status } : o));
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to remove this product from the festive store?')) return;
    try {
      await api.deleteAdminProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newTitle) return;
    try {
      const res = await api.createAdminProduct({
        title: newTitle,
        shortDescription: newShortDesc || 'Handcrafted traditional festival creation.',
        description: 'Authentically crafted using safe, lawful materials for peaceful celebrations.',
        price: Number(newPrice),
        originalPrice: Number(newOriginalPrice),
        categoryId: newCategory,
        categoryName: categories.find(c => c.id === newCategory)?.name || 'Decorations',
        images: [newImage],
        inStock: true,
        stockQuantity: Number(newStock),
        rating: 5.0,
        reviewCount: 1,
        sku: `UV-${Date.now().toString().slice(-4)}`
      });

      setProducts([res.product, ...products]);
      setShowAddProductModal(false);
      setNewTitle('');
      setNewShortDesc('');
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => (o.orderStatus || (o as any).status) === orderFilter);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E1D8] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#FDFCF8] border border-[#D4AF37]/40 text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Store Operations Console</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#333333]">
            Utsav Veda Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="px-4 py-2 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold text-[#555555] hover:bg-[#FDFCF8]"
          >
            Preview Customer Store
          </button>
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Festive Item</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border border-[#E5E1D8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#777777] font-bold uppercase">Total Revenue</span>
            <div className="w-9 h-9 rounded-md bg-[#FDFCF8] border border-[#D4AF37]/30 flex items-center justify-center text-[#8B0000]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-[#8B0000] mt-2">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[11px] text-green-700 font-semibold mt-1">Across all confirmed customer orders</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E5E1D8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#777777] font-bold uppercase">Total Orders</span>
            <div className="w-9 h-9 rounded-md bg-[#FDFCF8] border border-[#D4AF37]/30 flex items-center justify-center text-[#8B0000]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-[#333333] mt-2">{orders.length}</p>
          <p className="text-[11px] text-[#777777] mt-1">{pendingOrdersCount} requiring fulfillment</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E5E1D8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#777777] font-bold uppercase">Live Catalog</span>
            <div className="w-9 h-9 rounded-md bg-[#FDFCF8] border border-[#D4AF37]/30 flex items-center justify-center text-[#8B0000]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-[#333333] mt-2">{products.length}</p>
          <p className="text-[11px] text-green-700 font-semibold mt-1">{inStockProductsCount} active in stock</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#E5E1D8] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#777777] font-bold uppercase">Safe Products</span>
            <div className="w-9 h-9 rounded-md bg-[#FDFCF8] border border-[#D4AF37]/30 flex items-center justify-center text-[#8B0000]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-serif text-2xl font-extrabold text-green-700 mt-2">100%</p>
          <p className="text-[11px] text-[#777777] mt-1">Lawful & non-hazardous certified</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E1D8] gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'overview' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#777777] hover:text-[#333333]'
          }`}
        >
          Orders & Fulfillment
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'products' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#777777] hover:text-[#333333]'
          }`}
        >
          Product Inventory ({products.length})
        </button>
      </div>

      {/* TAB: ORDERS & FULFILLMENT */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-serif text-lg font-bold text-[#333333]">Manage Customer Orders</h2>
            
            {/* Filter by status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#777777] font-semibold">Status:</span>
              <select
                value={orderFilter}
                onChange={e => setOrderFilter(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold focus:outline-hidden focus:border-[#8B0000]"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E1D8] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FDFCF8] border-b border-[#E5E1D8] text-[#555555] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Order No.</th>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8] text-[#555555]">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FDFCF8]/80">
                      <td className="p-4 font-bold text-[#8B0000]">
                        {order.orderNumber}
                        <p className="text-[10px] text-[#777777] font-normal">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[#333333]">{order.shippingAddress?.fullName || 'Customer'}</p>
                        <p className="text-[10px] text-[#777777]">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      </td>
                      <td className="p-4">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="truncate max-w-xs text-[11px]">
                            {it.quantity}x {it.title}
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-bold text-[#333333]">₹{order.total}</td>
                      <td className="p-4 uppercase text-[11px] font-semibold">{order.paymentMethod}</td>
                      <td className="p-4">
                        {(() => {
                          const status = order.orderStatus || (order as any).status || 'pending';
                          return (
                            <span className={`px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                              status === 'delivered' ? 'bg-green-100 text-green-800' :
                              status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {status}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.orderStatus || (order as any).status || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="px-2 py-1 rounded-md bg-white border border-[#E5E1D8] text-xs font-semibold focus:outline-hidden focus:border-[#8B0000]"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PRODUCT INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="font-serif text-lg font-bold text-[#333333]">Festive Inventory</h2>
            
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-white border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
              />
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E5E1D8] overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#FDFCF8] border-b border-[#E5E1D8] text-[#555555] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E1D8] text-[#555555]">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-[#FDFCF8]/80">
                      <td className="p-4 flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-10 rounded-md object-cover border border-[#E5E1D8]" />
                        <span className="font-bold text-[#333333] max-w-xs truncate">{p.title}</span>
                      </td>
                      <td className="p-4">{p.categoryName}</td>
                      <td className="p-4 font-bold text-[#8B0000]">₹{p.price}</td>
                      <td className="p-4 font-semibold text-green-700">{p.stockQuantity} in stock</td>
                      <td className="p-4">★ {p.rating} ({p.reviewCount})</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50"
                          title="Remove Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-[#333333] max-w-lg w-full rounded-lg p-6 shadow-2xl border border-[#E5E1D8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3 mb-4">
              <h3 className="font-serif text-lg font-bold text-[#8B0000]">Add New Festive Item</h3>
              <button onClick={() => setShowAddProductModal(false)} className="p-1 text-gray-500 hover:text-[#333333]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#333333] mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Peacock Engraved Brass Aarti Bell"
                  className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={e => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#333333] mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-1">Image URL</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={e => setNewImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#333333] mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newShortDesc}
                  onChange={e => setNewShortDesc(e.target.value)}
                  placeholder="Short festive product highlight..."
                  className="w-full px-3 py-2 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs uppercase tracking-wider shadow-2xs transition-colors"
                >
                  Publish Item to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
