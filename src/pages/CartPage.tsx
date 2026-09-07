import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Truck, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface CartPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    applyCoupon, 
    removeCoupon,
    clearCart
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponMsg({ text: `Coupon "${couponInput.toUpperCase()}" applied successfully!`, type: 'success' });
      setCouponInput('');
    } else {
      setCouponMsg({ text: 'Invalid or expired festive coupon code.', type: 'error' });
    }
  };

  const freeShippingThreshold = 999;
  const neededForFreeShipping = Math.max(0, freeShippingThreshold - cart.subtotal);
  const freeShippingPercent = Math.min(100, (cart.subtotal / freeShippingThreshold) * 100);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4 text-center">
        <div className="bg-white rounded-lg border border-[#E5E1D8] p-10 sm:p-16 shadow-2xs space-y-5">
          <div className="w-16 h-16 rounded-full bg-[#FDFCF8] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#8B0000]">
            <ShoppingBag className="w-8 h-8 text-[#8B0000]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#333333]">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto leading-relaxed">
            Discover our auspicious collection of handcrafted terracotta diyas, sacred brass thalis, and dazzling festive lights.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="px-8 py-3 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-2"
            >
              <span>Explore Festive Store</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-[#777777] mb-2">
          <button onClick={() => onNavigate('home')} className="hover:text-[#8B0000]">Home</button>
          <span>/</span>
          <span className="font-semibold text-[#333333]">Shopping Bag</span>
        </div>
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#333333]">
            Your Festive Cart ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} Items)
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-rose-700 hover:underline font-semibold"
          >
            Clear Entire Bag
          </button>
        </div>
      </div>

      {/* Free Shipping Milestone Progress Meter */}
      <div className="p-4 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8]">
        <div className="flex items-center justify-between text-xs font-bold text-[#333333] mb-2">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#8B0000]" />
            {neededForFreeShipping === 0 ? (
              <span className="text-green-800 font-semibold">Unlocked: Free Express Delivery!</span>
            ) : (
              <span>Add ₹{neededForFreeShipping} more to unlock Free Pan-India Delivery!</span>
            )}
          </span>
          <span className="text-[#777777]">{Math.round(freeShippingPercent)}%</span>
        </div>
        <div className="w-full h-2 bg-[#E5E1D8] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#8B0000] transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items List (Left) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-[#E5E1D8] overflow-hidden shadow-2xs divide-y divide-[#E5E1D8]">
            {cart.items.map(item => (
              <div key={`${item.productId}-${item.variant || 'default'}`} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                
                {/* Product Thumbnail */}
                <div 
                  onClick={() => onNavigate('product-detail', { productId: item.productId })}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-[#FDFCF8] border border-[#E5E1D8] shrink-0 cursor-pointer"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center sm:text-left space-y-1 w-full">
                  <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-wider bg-[#FDFCF8] px-2 py-0.5 rounded-sm border border-[#D4AF37]/30">
                    {item.product.categoryName}
                  </span>
                  <h3 
                    onClick={() => onNavigate('product-detail', { productId: item.productId })}
                    className="font-serif text-sm sm:text-base font-bold text-[#333333] hover:text-[#8B0000] cursor-pointer line-clamp-1"
                  >
                    {item.product.title}
                  </h3>
                  {item.variant && (
                    <p className="text-xs text-[#777777]">
                      Option: <span className="font-semibold text-[#555555]">{item.variant}</span>
                    </p>
                  )}
                  <div className="flex items-baseline justify-center sm:justify-start gap-2 pt-1">
                    <span className="font-bold text-sm text-[#8B0000]">₹{item.product.price}</span>
                    {item.product.originalPrice > item.product.price && (
                      <span className="text-xs text-[#888888] line-through">₹{item.product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex sm:flex-col items-center justify-between gap-3 w-full sm:w-auto">
                  <div className="flex items-center rounded-md border border-[#E5E1D8] bg-[#FDFCF8] overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                      className="px-2.5 py-1 text-sm font-bold text-[#555555] hover:bg-white"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-[#333333]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                      className="px-2.5 py-1 text-sm font-bold text-[#555555] hover:bg-white"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm sm:text-base text-[#333333]">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>

                {/* Action buttons (Wishlist, Remove) */}
                <div className="flex sm:flex-col gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E1D8] w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      toggleWishlist(item.productId);
                      removeFromCart(item.productId, item.variant);
                    }}
                    className="p-2 rounded-md text-[#777777] hover:text-[#8B0000] hover:bg-[#FDFCF8] transition-colors text-xs flex items-center gap-1"
                    title="Move to Wishlist"
                  >
                    <Heart className="w-4 h-4" />
                    <span className="sm:hidden text-xs">Save</span>
                  </button>

                  <button
                    onClick={() => removeFromCart(item.productId, item.variant)}
                    className="p-2 rounded-md text-[#777777] hover:text-rose-700 hover:bg-rose-50 transition-colors text-xs flex items-center gap-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden text-xs">Delete</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('shop')}
              className="text-xs font-bold text-[#8B0000] hover:underline flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Continue Festive Shopping</span>
            </button>
          </div>
        </div>

        {/* Order Summary Box (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 shadow-2xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#333333] border-b border-[#E5E1D8] pb-3">
              Order Financial Summary
            </h3>

            {/* Coupon Application */}
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-1.5 uppercase tracking-wider">
                Have a Festive Promo Code?
              </label>
              
              {cart.couponCode ? (
                <div className="p-3 rounded-md bg-green-50 border border-green-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-green-800 font-bold">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span>Coupon: {cart.couponCode}</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-gray-500 hover:text-rose-700 p-1"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. FESTIVE20, UTSAV500"
                    className="flex-1 px-3 py-2 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] uppercase font-bold focus:outline-hidden focus:border-[#8B0000]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <div className={`mt-2 text-[11px] flex items-center gap-1.5 ${couponMsg.type === 'success' ? 'text-green-700 font-semibold' : 'text-rose-600 font-semibold'}`}>
                  {couponMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{couponMsg.text}</span>
                </div>
              )}

              <div className="mt-2 text-[10px] text-[#777777]">
                Tip: Try <span className="font-bold text-[#8B0000] cursor-pointer" onClick={() => setCouponInput('FESTIVE20')}>FESTIVE20</span> for 20% off or <span className="font-bold text-[#8B0000] cursor-pointer" onClick={() => setCouponInput('UTSAV500')}>UTSAV500</span> on orders &gt; ₹1999.
              </div>
            </div>

            {/* Financial Rows */}
            <div className="space-y-2.5 text-xs text-[#555555] pt-3 border-t border-[#E5E1D8]">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-bold text-[#333333]">₹{cart.subtotal}</span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>Festive Coupon Discount</span>
                  <span>- ₹{cart.discount}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                {cart.shippingFee === 0 ? (
                  <span className="text-green-700 font-bold uppercase text-[10px] bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
                    FREE
                  </span>
                ) : (
                  <span className="font-bold text-[#333333]">₹{cart.shippingFee}</span>
                )}
              </div>

              <div className="pt-3 border-t border-[#E5E1D8] flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-[#333333]">Grand Total</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#8B0000]">₹{cart.total}</span>
                  <p className="text-[10px] text-[#777777]">Inclusive of all GST taxes</p>
                </div>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => onNavigate('checkout')}
              className="w-full py-3.5 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Security Guarantee */}
            <div className="pt-2 text-center text-[11px] text-[#777777] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              <span>256-Bit SSL Encrypted & 100% Lawful Products</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
