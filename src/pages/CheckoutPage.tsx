import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ChevronLeft, 
  Sparkles, 
  Printer, 
  Package,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { Address, Order } from '../types.ts';
import { api } from '../services/api.ts';

interface CheckoutPageProps {
  onNavigate: (view: string, data?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();

  // Stepper: 1 = Contact & Address, 2 = Payment, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address Form State
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [street, setStreet] = useState(user?.addresses?.[0]?.street || '12B, Heritage Residency, MI Road');
  const [city, setCity] = useState(user?.addresses?.[0]?.city || 'Jaipur');
  const [state, setState] = useState(user?.addresses?.[0]?.state || 'Rajasthan');
  const [pincode, setPincode] = useState(user?.addresses?.[0]?.pincode || '302001');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('10/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing state
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Handle Step 1 to Step 2
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !street || !city || !state || !pincode) {
      setErrorMsg('Please complete all contact and shipping address fields.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Place Order
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setErrorMsg(null);

    const shippingAddress: Address = {
      fullName: customerName,
      phone: customerPhone,
      street,
      city,
      state,
      pincode,
      isDefault: true
    };

    try {
      const res = await api.createOrder({
        shippingAddress,
        items: cart.items.map(i => ({
          productId: i.productId,
          title: i.product.title,
          image: i.product.images[0],
          price: i.product.price,
          quantity: i.quantity,
          variant: i.variant
        })),
        subtotal: cart.subtotal,
        discount: cart.discount,
        shippingFee: cart.shippingFee,
        total: cart.total,
        couponCode: cart.couponCode || undefined,
        paymentMethod,
        token: token || undefined
      });

      setConfirmedOrder(res.order);
      clearCart();
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If cart is empty and not on step 3 (confirmation)
  if (cart.items.length === 0 && step !== 3) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-lg border border-[#E5E1D8] text-center space-y-4">
        <h2 className="font-serif text-xl font-bold text-[#8B0000]">Your Cart is Empty</h2>
        <p className="text-xs text-[#666666]">Add some celebratory festival merchandise before checking out.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000]"
        >
          Browse Festive Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Checkout Progress Stepper */}
      <div className="max-w-xl mx-auto flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5E1D8] -translate-y-1/2 z-0" />
        
        <div className={`relative z-10 flex flex-col items-center gap-1.5`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-[#8B0000] text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <span className="text-[11px] font-bold text-[#333333]">Delivery Address</span>
        </div>

        <div className={`relative z-10 flex flex-col items-center gap-1.5`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-[#8B0000] text-white' : 'bg-[#FDFCF8] border border-[#D4AF37] text-[#8B0000]'
          }`}>
            2
          </div>
          <span className="text-[11px] font-bold text-[#333333]">Payment</span>
        </div>

        <div className={`relative z-10 flex flex-col items-center gap-1.5`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 3 ? 'bg-green-700 text-white' : 'bg-[#FDFCF8] border border-[#D4AF37] text-[#8B0000]'
          }`}>
            3
          </div>
          <span className="text-[11px] font-bold text-[#333333]">Confirmation</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 max-w-xl mx-auto">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: CONTACT & SHIPPING ADDRESS */}
      {step === 1 && (
        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-lg border border-[#E5E1D8] p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#333333]">
                1. Customer & Delivery Information
              </h2>
              <p className="text-xs text-[#666666] mt-1">
                Where should we carefully dispatch your handcrafted festive items?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#333333] mb-1">Full Recipient Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#333333] mb-1">Street Address, House/Flat No.</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  placeholder="e.g. Flat 402, Lotus Grandeur, MI Road"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Jaipur"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                  placeholder="e.g. Rajasthan"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#333333] mb-1">PIN Code</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  placeholder="e.g. 302001"
                  className="w-full px-3.5 py-2.5 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
              </div>

              <div className="flex items-center pt-5">
                <span className="text-[11px] text-green-700 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Free Express Delivery Available
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <span>Continue to Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mini Summary on Right */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 shadow-2xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#333333] border-b border-[#E5E1D8] pb-2">
                Bag Summary ({cart.items.length} items)
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.items.map(i => (
                  <div key={i.productId} className="flex items-center gap-3 text-xs">
                    <img src={i.product.images[0]} alt="" className="w-12 h-12 rounded-md object-cover border border-[#E5E1D8]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#333333] truncate">{i.product.title}</p>
                      <p className="text-[11px] text-[#777777]">Qty: {i.quantity} {i.variant && `• ${i.variant}`}</p>
                    </div>
                    <span className="font-bold text-[#8B0000]">₹{i.product.price * i.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-[#E5E1D8] space-y-1.5 text-xs text-[#555555]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#333333]">₹{cart.subtotal}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Festive Discount</span>
                    <span>- ₹{cart.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span>{cart.shippingFee === 0 ? 'FREE' : `₹${cart.shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#333333] pt-2 border-t border-[#E5E1D8]">
                  <span>Total Payable</span>
                  <span className="text-xl text-[#8B0000] font-bold">₹{cart.total}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT METHOD SELECTION */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-lg border border-[#E5E1D8] p-6 sm:p-8 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#333333]">
                  2. Choose Payment Method
                </h2>
                <p className="text-xs text-[#666666]">
                  All transactions are 256-bit encrypted and bank certified.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#8B0000] hover:underline flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Edit Address
              </button>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3">
              
              {/* UPI Option */}
              <label className={`p-4 rounded-lg border transition-all flex flex-col gap-3 cursor-pointer ${
                paymentMethod === 'upi' ? 'border-[#8B0000] bg-[#FDFCF8]' : 'border-[#E5E1D8] hover:border-[#D4AF37]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="accent-[#8B0000]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#333333]">Instant UPI (Google Pay, PhonePe, Paytm, BHIM)</h4>
                      <p className="text-[11px] text-[#777777]">Zero transaction charges. Direct banking authorization.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-sm border border-green-200">
                    Recommended
                  </span>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="pl-7 pt-2 border-t border-[#E5E1D8]">
                    <label className="block text-xs font-bold text-[#333333] mb-1">Enter Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@oksbi"
                      className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#E5E1D8]"
                    />
                  </div>
                )}
              </label>

              {/* Debit/Credit Card */}
              <label className={`p-4 rounded-lg border transition-all flex flex-col gap-3 cursor-pointer ${
                paymentMethod === 'card' ? 'border-[#8B0000] bg-[#FDFCF8]' : 'border-[#E5E1D8] hover:border-[#D4AF37]'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[#8B0000]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#333333]">Credit or Debit Cards</h4>
                    <p className="text-[11px] text-[#777777]">Visa, MasterCard, RuPay, Maestro</p>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="pl-7 pt-2 border-t border-[#E5E1D8] space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#333333] mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• ••••"
                        className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#E5E1D8]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#333333] mb-1">Valid Thru (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#E5E1D8]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#333333] mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3 py-2 text-xs rounded-md bg-white border border-[#E5E1D8]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* NetBanking */}
              <label className={`p-4 rounded-lg border transition-all flex flex-col gap-3 cursor-pointer ${
                paymentMethod === 'netbanking' ? 'border-[#8B0000] bg-[#FDFCF8]' : 'border-[#E5E1D8] hover:border-[#D4AF37]'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="accent-[#8B0000]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#333333]">Net Banking</h4>
                    <p className="text-[11px] text-[#777777]">All major Indian commercial banks supported</p>
                  </div>
                </div>

                {paymentMethod === 'netbanking' && (
                  <div className="pl-7 pt-2 border-t border-[#E5E1D8]">
                    <select
                      value={selectedBank}
                      onChange={e => setSelectedBank(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-md bg-white border border-[#E5E1D8]"
                    >
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Axis Bank">Axis Bank</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </label>

              {/* Cash On Delivery */}
              <label className={`p-4 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${
                paymentMethod === 'cod' ? 'border-[#8B0000] bg-[#FDFCF8]' : 'border-[#E5E1D8] hover:border-[#D4AF37]'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-[#8B0000]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#333333]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#777777]">Pay cash or scan courier QR on doorstep arrival</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Place Order CTA */}
            <button
              id="confirm-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full py-4 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{submitting ? 'Confirming with Banking Gateway...' : `Authorize & Pay ₹${cart.total}`}</span>
              <Lock className="w-4 h-4" />
            </button>

            <div className="text-center text-[11px] text-[#777777] flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-700" />
              <span>Safe 256-bit checkout • Instant SMS & Email order updates</span>
            </div>
          </div>

          {/* Delivery Recap on Right */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 shadow-2xs space-y-4">
              <h3 className="font-serif text-base font-bold text-[#333333] border-b border-[#E5E1D8] pb-2">
                Delivering To
              </h3>
              <div className="text-xs text-[#555555] space-y-1">
                <p className="font-bold text-[#333333]">{customerName}</p>
                <p>{street}</p>
                <p>{city}, {state} - {pincode}</p>
                <p className="text-[#777777]">Contact: {customerPhone}</p>
              </div>

              <div className="pt-3 border-t border-[#E5E1D8] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Grand Total Payable:</span>
                  <span className="text-lg font-bold text-[#8B0000]">₹{cart.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: ORDER CONFIRMED CELEBRATION */}
      {step === 3 && confirmedOrder && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg border border-[#E5E1D8] p-8 sm:p-12 shadow-2xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-[#FDFCF8] border border-[#D4AF37]/40 text-[#8B0000] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Auspicious Celebration Guaranteed</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#333333]">
              Thank You! Your Festive Order is Confirmed
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] mt-2">
              We have received your order and our artisan fulfillment team has begun careful packing.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="p-4 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] text-xs text-[#555555] text-left space-y-2">
            <div className="flex justify-between items-center border-b border-[#E5E1D8] pb-2">
              <span className="text-[#777777]">Order Tracking Number:</span>
              <span className="font-bold text-[#8B0000]">{confirmedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#777777]">Estimated Pan-India Arrival:</span>
              <span className="font-bold text-[#333333]">{confirmedOrder.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#777777]">Total Amount Paid:</span>
              <span className="font-bold text-[#8B0000]">₹{confirmedOrder.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#777777]">Payment Mode:</span>
              <span className="font-bold text-[#333333] uppercase">{confirmedOrder.paymentMethod}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('account', { tab: 'orders' })}
              className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold transition-all shadow-2xs"
            >
              Track Order Status in Account
            </button>

            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-white border border-[#E5E1D8] hover:bg-[#FDFCF8] text-xs font-bold text-[#555555] flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[#FDFCF8] border border-[#D4AF37]/50 text-[#8B0000] text-xs font-bold hover:bg-[#FAF2DE]"
            >
              Shop More
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
