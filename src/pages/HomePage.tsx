import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  Heart, 
  Gift, 
  Tag, 
  ChevronRight,
  Smile
} from 'lucide-react';
import { Category, Product } from '../types.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface HomePageProps {
  onNavigate: (view: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cat-2' | 'cat-4' | 'cat-5'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 8 })
        ]);
        setCategories(catRes.categories);
        setFeaturedProducts(prodRes.products);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProducts = selectedFilter === 'all'
    ? featuredProducts
    : featuredProducts.filter(p => p.categoryId === selectedFilter);

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (Sleek Interface Aesthetic) */}
      {/* ------------------------------------------------------------- */}
      <section className="relative bg-[#1A1A1A] overflow-hidden flex items-center py-16 sm:py-24 text-[#FDFCF8]">
        {/* Radial Dark Crimson Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#8B0000_0%,#1A1A1A_100%)] opacity-40 pointer-events-none" />
        
        {/* Sleek Skewed Crimson Accent */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-[#8B0000] skew-x-[-12deg] translate-x-20 opacity-80 hidden lg:block pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sacred Festive Heritage 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#FDFCF8] leading-tight tracking-tight">
                Authentic Traditions for <br className="hidden sm:inline" />
                <span className="italic text-[#D4AF37]">Festive Moments</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#CCCCCC] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Adorn your auspicious home with masterfully hand-painted terracotta diyas, heirloom brass puja thalis, radiant ambient fairy lights, and royal celebratory hampers. 100% lawful, ethical, and hand-molded by rural Indian artisans.
              </p>

              {/* Action Buttons (Sleek Interface Style) */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => onNavigate('shop')}
                  className="w-full sm:w-auto bg-[#D4AF37] text-white px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#b45309] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Shop Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-explore-categories-btn"
                  onClick={() => {
                    const el = document.getElementById('categories-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto border border-[#FDFCF8] text-[#FDFCF8] px-8 py-3.5 text-[12px] font-bold uppercase tracking-widest hover:bg-[#FDFCF8] hover:text-black transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-[#D4AF37]" />
                  <span>Explore Categories</span>
                </button>
              </div>

              {/* Sleek Trust Markers */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[11px] text-[#DDDDDD] uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>100% Lawful Products</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Artisan Handcrafted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pan-India Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase (Sleek Dual Circular Frame) */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="relative">
                {/* Outer Circular Frame */}
                <div className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-[#D4AF37] rounded-full flex items-center justify-center p-3 sm:p-4 bg-[#1A1A1A]/90 shadow-2xl relative">
                  {/* Inner Dashed Circle */}
                  <div className="w-full h-full border border-dashed border-[#D4AF37] rounded-full flex items-center justify-center flex-col text-center p-4">
                    <span className="text-[#D4AF37] text-3xl sm:text-4xl font-serif">Diwali</span>
                    <span className="text-white text-[10px] tracking-widest uppercase opacity-60 mt-1">Collection 2026</span>
                    <div className="h-0.5 w-8 bg-[#8B0000] my-2" />
                    <span className="text-[#D4AF37] text-[11px] font-bold tracking-widest uppercase">Pure Artisanship</span>
                  </div>
                </div>

                {/* Floating Sleek Badges */}
                <div className="absolute -bottom-3 -left-4 bg-[#FDFCF8] text-[#333333] px-3.5 py-2 rounded-lg shadow-xl border border-[#E5E1D8] hidden sm:flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B0000] animate-ping" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#8B0000]">Promo Code</p>
                    <p className="text-[11px] font-medium text-[#333333]">Use <strong className="text-[#8B0000]">FESTIVE20</strong> for 20% OFF</p>
                  </div>
                </div>

                <div className="absolute -top-3 -right-4 bg-[#FDFCF8] text-[#333333] px-3.5 py-2 rounded-lg shadow-xl border border-[#E5E1D8] hidden sm:flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="text-[11px] font-bold">4.9 / 5.0</span>
                  <span className="text-[10px] text-gray-500">• 1,200+ Reviews</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. CATEGORIES SECTION */}
      {/* ------------------------------------------------------------- */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-[#E5E1D8] pb-4">
          <div>
            <h2 className="text-2xl font-serif text-[#333333] tracking-tight">
              Shop by Festive Category
            </h2>
            <div className="h-1 w-12 bg-[#8B0000] mt-1.5"></div>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-[11px] font-bold uppercase tracking-wider text-[#8B0000] hover:underline flex items-center gap-1"
          >
            View All Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              id={`cat-card-${cat.slug}`}
              onClick={() => onNavigate('shop', { categorySlug: cat.slug })}
              className="group bg-white rounded-xl border border-[#E5E1D8] hover:border-[#D4AF37] p-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col text-center"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-[#F5F2EA] mb-2.5 relative border border-[#E5E1D8]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-medium text-[#333333] group-hover:text-[#8B0000] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider">
                {cat.itemCount} Items
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. FEATURED PRODUCTS SECTION */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-[#E5E1D8] pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-serif text-[#333333] tracking-tight">
              Featured Festive Creations
            </h2>
            <div className="h-1 w-12 bg-[#8B0000] mt-1.5"></div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-[#F5F2EA] text-[#333333] border border-[#E5E1D8] hover:border-[#8B0000]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('cat-2')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedFilter === 'cat-2'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-[#F5F2EA] text-[#333333] border border-[#E5E1D8] hover:border-[#8B0000]'
              }`}
            >
              Diyas & Lamps
            </button>
            <button
              onClick={() => setSelectedFilter('cat-4')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedFilter === 'cat-4'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-[#F5F2EA] text-[#333333] border border-[#E5E1D8] hover:border-[#8B0000]'
              }`}
            >
              Pūjā Essentials
            </button>
            <button
              onClick={() => setSelectedFilter('cat-5')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                selectedFilter === 'cat-5'
                  ? 'bg-[#8B0000] text-white shadow-xs'
                  : 'bg-[#F5F2EA] text-[#333333] border border-[#E5E1D8] hover:border-[#8B0000]'
              }`}
            >
              Decorative Lights
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-[#F5F2EA] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(id) => onNavigate('product-detail', { productId: id })}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('shop')}
            className="px-8 py-3 bg-white border border-[#8B0000] text-[#8B0000] font-bold text-[12px] uppercase tracking-widest hover:bg-[#8B0000] hover:text-white transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. PROMOTIONAL FESTIVE BANNER */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#8B0000] text-[#FDFCF8] p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#D4AF37]/30">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-widest">
                <Tag className="w-3.5 h-3.5" />
                Limited Festive Season Offer
              </span>

              <h3 className="font-serif text-2xl sm:text-4xl font-bold leading-snug">
                Grand Celebration Special <br />
                <span className="text-[#FFD700]">Up to 40% Off Handcrafted Heirlooms</span>
              </h3>

              <p className="text-xs sm:text-sm text-gray-200 max-w-xl">
                Elevate your mandir, veranda, and gifting moments. Use coupon code <strong className="text-white px-1.5 py-0.5 rounded bg-black/40 border border-[#D4AF37]/40 tracking-wider">FESTIVE20</strong> for an instant 20% discount on all orders over ₹999.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-6 py-3 bg-[#D4AF37] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-[#b45309] transition-colors shadow-md flex items-center gap-2"
                >
                  <span>Claim Festive Discount</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-[#F5E6BA]">• Free Shipping Applied</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="p-5 rounded-xl bg-black/20 backdrop-blur-xs border border-white/20 text-center max-w-xs w-full">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37] text-[#8B0000] mx-auto flex items-center justify-center font-bold text-xl shadow-md mb-2">
                  🪔
                </div>
                <h4 className="font-serif font-bold text-sm text-white">Artisan Fair-Trade Promise</h4>
                <p className="text-[11px] text-gray-200 mt-1">
                  100% of profits from our terracotta and hand-painted lines go directly to traditional Indian artisan families.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. WHY CHOOSE US */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-serif text-[#333333] tracking-tight">
            Why Families Celebrate with Utsav Veda
          </h2>
          <div className="h-1 w-12 bg-[#8B0000] mx-auto mt-2"></div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Designed for mindful, responsible, and blissful celebrations across India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#E5E1D8] hover:border-[#D4AF37] shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#F5F2EA] border border-[#E5E1D8] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-[#8B0000]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#333333] mb-1">100% Lawful & Safe</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We exclusively provide non-hazardous, age-appropriate festival crafts, lights, and decor. Strictly zero fireworks or hazardous materials.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E5E1D8] hover:border-[#D4AF37] shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#F5F2EA] border border-[#E5E1D8] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-[#8B0000]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#333333] mb-1">Authentic Artisanship</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every brass pooja thali and painted terracotta diya is created with reverence by heritage craftspeople using natural materials.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E5E1D8] hover:border-[#D4AF37] shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#F5F2EA] border border-[#E5E1D8] flex items-center justify-center mb-3">
              <Truck className="w-5 h-5 text-[#8B0000]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#333333] mb-1">Secure Transit Packaging</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Double-boxed eco-friendly honeycomb protection ensures delicate clay and glass articles reach your home in flawless condition.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E5E1D8] hover:border-[#D4AF37] shadow-xs transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#F5F2EA] border border-[#E5E1D8] flex items-center justify-center mb-3">
              <Smile className="w-5 h-5 text-[#8B0000]" />
            </div>
            <h3 className="font-serif text-sm font-bold text-[#333333] mb-1">Festive Customer Care</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our festive assistance team is available 7 days a week with instant replacement guarantees and order tracking support.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. CUSTOMER TESTIMONIALS */}
      {/* ------------------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#F5F2EA] border border-[#E5E1D8]">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="font-serif text-2xl text-[#333333]">
              Loved by Festive Homes
            </h2>
            <div className="h-1 w-12 bg-[#8B0000] mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs space-y-2.5">
              <div className="flex text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />)}
              </div>
              <p className="text-xs text-[#555555] italic leading-relaxed">
                "The Handcrafted Terracotta Painted Diyas are simply breathtaking. The colors were so vivid, and having zero plastic or hazardous components made our Diwali eco-friendly and deeply meaningful."
              </p>
              <div className="pt-2 border-t border-[#E5E1D8]">
                <p className="text-xs font-bold text-[#333333]">Pooja & Sameer Sharma</p>
                <p className="text-[10px] text-green-700 font-semibold">Verified Buyer • Mumbai</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs space-y-2.5">
              <div className="flex text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />)}
              </div>
              <p className="text-xs text-[#555555] italic leading-relaxed">
                "We ordered the 8-Piece Royal Brass Pooja Thali for our housewarming puja. The weight of the brass and the fine peacock engraving are outstanding. Arrived packed like jewels!"
              </p>
              <div className="pt-2 border-t border-[#E5E1D8]">
                <p className="text-xs font-bold text-[#333333]">Ananya Iyer</p>
                <p className="text-[10px] text-green-700 font-semibold">Verified Buyer • Bengaluru</p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#E5E1D8] shadow-xs space-y-2.5">
              <div className="flex text-[#D4AF37]">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />)}
              </div>
              <p className="text-xs text-[#555555] italic leading-relaxed">
                "The fairy curtain lights brought the warmest golden glow to our balcony. Safe to touch, low electricity draw, and the remote controller modes made evening prayers truly blissful."
              </p>
              <div className="pt-2 border-t border-[#E5E1D8]">
                <p className="text-xs font-bold text-[#333333]">Vikramaditya Mehta</p>
                <p className="text-[10px] text-green-700 font-semibold">Verified Buyer • New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
