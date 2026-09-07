import React, { useState } from 'react';
import { 
  Flame, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Truck,
  RotateCcw,
  Lock,
  FileText
} from 'lucide-react';
import { api } from '../services/api.ts';

interface FooterProps {
  onNavigate: (view: string, data?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionMsg, setSubscriptionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscriptionMsg({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }
    setSubscribing(true);
    try {
      const res = await api.subscribeNewsletter(email);
      setSubscriptionMsg({ text: res.message, type: 'success' });
      setEmail('');
    } catch (err: any) {
      setSubscriptionMsg({ text: err.message || 'Subscription failed. Please try again.', type: 'error' });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[#1A1A1A] text-white border-t-2 border-[#D4AF37] relative overflow-hidden">
      {/* Subtle festive decorative background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8B0000]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Trust & Safety Highlights Strip */}
      <div className="border-b border-[#2A2A2A] bg-[#161616] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#222222] border border-[#333333]">
            <div className="w-9 h-9 rounded-md bg-[#8B0000]/40 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Lawful Products</h4>
              <p className="text-[11px] text-gray-400">Purely safe decorative & pooja items. Zero fireworks.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#222222] border border-[#333333]">
            <div className="w-9 h-9 rounded-md bg-[#8B0000]/40 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pan-India Express Dispatch</h4>
              <p className="text-[11px] text-gray-400">Careful tamper-proof packaging with live tracking.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#222222] border border-[#333333]">
            <div className="w-9 h-9 rounded-md bg-[#8B0000]/40 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <RotateCcw className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hassle-Free Replacements</h4>
              <p className="text-[11px] text-gray-400">7-day easy returns & transit damage guarantee.</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#222222] border border-[#333333]">
            <div className="w-9 h-9 rounded-md bg-[#8B0000]/40 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safe & Encrypted Checkout</h4>
              <p className="text-[11px] text-gray-400">Official banking gateways. No card details stored.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#8B0000] flex items-center justify-center border border-[#D4AF37]">
                <Flame className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-[#D4AF37] uppercase">
                UTSAV VEDA
              </span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed pr-6">
              Utsav Veda crafts festive elegance through authentic, handcrafted celebration products. We curate 100% lawful, eco-conscious, and safe festive merchandise — from terracotta hand-painted diyas and brass pooja thalis to ambient warm fairy lights and luxury hampers.
            </p>

            <div className="pt-1 text-xs text-[#D4AF37] flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 fill-[#8B0000] text-[#8B0000]" />
              <span>Directly empowering over 250+ traditional rural craft families.</span>
            </div>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
                Join the Festive Circle
              </h4>
              <p className="text-xs text-gray-400 mb-3">
                Subscribe for exclusive festive discount drops and artisan stories.
              </p>
              <form onSubmit={handleSubscribe} className="flex max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-[#2A2A2A] text-xs px-3.5 py-2.5 text-white outline-none border border-transparent focus:border-[#D4AF37] flex-1 rounded-l-md"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-[#8B0000] hover:bg-[#700000] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 rounded-r-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{subscribing ? '...' : 'Join'}</span>
                </button>
              </form>

              {subscriptionMsg && (
                <div className={`mt-2 text-xs flex items-center gap-1.5 ${subscriptionMsg.type === 'success' ? 'text-green-400' : 'text-rose-400'}`}>
                  {subscriptionMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  <span>{subscriptionMsg.text}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => onNavigate('shop', { categorySlug: 'festival-decorations' })} className="hover:text-white transition-colors">
                  Festival Decorations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categorySlug: 'diyas-and-lamps' })} className="hover:text-white transition-colors">
                  Diyas & Oil Lamps
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categorySlug: 'gift-items' })} className="hover:text-white transition-colors">
                  Festive Gift Hampers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categorySlug: 'puja-accessories' })} className="hover:text-white transition-colors">
                  Pūjā & Temple Essentials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categorySlug: 'decorative-lights' })} className="hover:text-white transition-colors">
                  Decorative & Fairy Lights
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { categorySlug: 'party-supplies' })} className="hover:text-white transition-colors">
                  Celebration Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button onClick={() => setActivePolicyModal('faq')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('shipping')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('returns')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Returns & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('privacy')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setActivePolicyModal('terms')} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Bulk & Corporate Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
              Store Contact
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Utsav Veda Artisan House, 44 Heritage Way, MI Road, Jaipur, Rajasthan 302001, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+91 1800 887 2899 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>care@utsavveda.com</span>
              </div>
              <div className="pt-2 text-[11px] text-gray-500">
                <p className="font-semibold text-gray-300">Festive Support Hours:</p>
                <p>Monday - Sunday: 9:00 AM - 9:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Responsible Commerce Disclaimer Banner */}
      <div className="bg-[#121212] border-t border-[#2A2A2A] py-3.5 px-4 text-center text-[11px] text-gray-400">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
          <span>
            <strong>Responsible Commerce Guarantee:</strong> Utsav Veda exclusively sells lawful, non-explosive, age-appropriate festive decorative crafts, brass puja articles, and celebration gifts. We strictly do not manufacture, sell, ship, or facilitate fireworks or restricted items.
          </span>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="border-t border-[#2A2A2A] bg-[#0E0E0E] py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Utsav Veda Festive Products Pvt. Ltd. All rights reserved.</p>
          
          {/* Payment Trust Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">Secured By:</span>
            <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#333333] text-[10px] text-gray-300">UPI / GPay</span>
            <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#333333] text-[10px] text-gray-300">RuPay</span>
            <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#333333] text-[10px] text-gray-300">Visa & Mastercard</span>
            <span className="px-2 py-0.5 rounded bg-[#1C1C1C] border border-[#333333] text-[10px] text-gray-300">NetBanking</span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] text-[#221C16] max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#D4AF37]/40 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DCCB] pb-4 mb-4">
              <h3 className="font-serif text-xl font-bold text-[#8B0000] capitalize">
                {activePolicyModal === 'faq' && 'Frequently Asked Questions (FAQ)'}
                {activePolicyModal === 'shipping' && 'Shipping & Delivery Policy'}
                {activePolicyModal === 'returns' && 'Returns & Replacements Policy'}
                {activePolicyModal === 'privacy' && 'Privacy & Data Protection Policy'}
                {activePolicyModal === 'terms' && 'Terms & Conditions of Festive Commerce'}
              </h3>
              <button 
                onClick={() => setActivePolicyModal(null)}
                className="w-8 h-8 rounded-full bg-[#EDE3D3] hover:bg-[#D4C3AC] flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#524438] space-y-3 leading-relaxed">
              {activePolicyModal === 'faq' && (
                <>
                  <p><strong>Q: Are the terracotta diyas reusable?</strong><br />A: Yes! Our terracotta diyas are kiln-fired and hand-lacquered. After the festival, wipe them with a soft cloth and store them in their protective gift box for future years.</p>
                  <p><strong>Q: How long does express delivery take?</strong><br />A: Metro cities take 2-3 business days. Rest of India takes 3-5 business days. Real-time tracking is provided via SMS and order history.</p>
                  <p><strong>Q: Does Utsav Veda sell firecrackers or explosives?</strong><br />A: Absolutely not. Utsav Veda strictly sells lawful, safe, non-explosive festival merchandise including diyas, electric fairy lights, brass thalis, and gift hampers.</p>
                </>
              )}
              {activePolicyModal === 'shipping' && (
                <>
                  <p>Orders above ₹999 qualify for Free Standard Delivery across India. For orders below ₹999, a flat delivery fee of ₹99 is applied.</p>
                  <p>All fragile handcrafted clay and brass items are double-boxed using eco-friendly honeycomb wrap and biodegradable void-fill cushions to prevent any breakage.</p>
                </>
              )}
              {activePolicyModal === 'returns' && (
                <>
                  <p>We take deep pride in artisan perfection. In the unlikely event of transit damage or manufacturing defect, report within 7 days of delivery with an unboxing photograph for an immediate zero-cost replacement or full refund.</p>
                </>
              )}
              {activePolicyModal === 'privacy' && (
                <>
                  <p>Utsav Veda respects your privacy. We never sell or lease your personal information. Card details are processed directly through certified PCI-DSS level 1 banking gateways and never stored on our servers.</p>
                </>
              )}
              {activePolicyModal === 'terms' && (
                <>
                  <p>By using Utsav Veda, you agree to celebrate respectfully and abide by our terms of ethical commerce. All product images reflect authentic handmade wares; minor natural variations in hand-painted strokes attest to genuine artisan craftsmanship.</p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8DCCB] text-right">
              <button
                onClick={() => setActivePolicyModal(null)}
                className="px-5 py-2 rounded-lg bg-[#8B0000] text-white text-xs font-semibold hover:bg-[#700000]"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
