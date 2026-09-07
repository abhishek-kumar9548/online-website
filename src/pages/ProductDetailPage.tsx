import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Sparkles, 
  Send, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { Product, Review } from '../types.ts';
import { api } from '../services/api.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { ProductCard } from '../components/ProductCard.tsx';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (view: string, data?: any) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  productId, 
  onNavigate, 
  onQuickView 
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Gallery
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Purchase state
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [addedAnim, setAddedAnim] = useState(false);

  // Review Form state
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'artisan' | 'reviews'>('desc');
  const [revRating, setRevRating] = useState(5);
  const [revTitle, setRevTitle] = useState('');
  const [revComment, setRevComment] = useState('');
  const [revName, setRevName] = useState(user?.name || '');
  const [submittingRev, setSubmittingRev] = useState(false);
  const [revSuccess, setRevSuccess] = useState<string | null>(null);
  const [revError, setRevError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProduct(productId);
        setProduct(res.product);
        setReviews(res.reviews);
        setRelatedProducts(res.related);
        if (res.product.variants && res.product.variants.length > 0) {
          setSelectedVariant(res.product.variants[0].options[0]);
        }
        setActiveImageIdx(0);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-white rounded-lg border border-[#E5E1D8] animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-md w-3/4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-md w-1/4 animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-lg border border-[#E5E1D8] space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#8B0000]">Product Not Found</h2>
        <p className="text-xs text-[#666666]">The festival item you are looking for may have been archived.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000]"
        >
          Return to Festive Store
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    onNavigate('checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revTitle || !revComment || !revName) {
      setRevError('Please fill out all review fields.');
      return;
    }
    setSubmittingRev(true);
    setRevError(null);
    try {
      const res = await api.submitReview({
        productId: product.id,
        rating: revRating,
        title: revTitle,
        comment: revComment,
        userName: revName
      });
      setReviews([res.review, ...reviews]);
      setRevSuccess('Thank you! Your verified review has been published.');
      setRevTitle('');
      setRevComment('');
    } catch (err: any) {
      setRevError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingRev(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs text-[#777777]">
        <button onClick={() => onNavigate('home')} className="hover:text-[#8B0000]">Home</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('shop')} className="hover:text-[#8B0000]">Festive Shop</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => onNavigate('shop', { categorySlug: product.categoryId })} className="hover:text-[#8B0000]">
          {product.categoryName}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#333333] truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Showcase: Gallery + Buy Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Gallery (Left) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-lg overflow-hidden bg-white border border-[#E5E1D8] shadow-2xs relative">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#8B0000] text-white text-[11px] font-bold px-3 py-1 rounded-sm shadow-sm tracking-wider uppercase">
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-20 h-20 rounded-md overflow-hidden border transition-all shrink-0 bg-white ${
                    activeImageIdx === idx 
                      ? 'border-[#8B0000] ring-1 ring-[#8B0000]' 
                      : 'border-[#E5E1D8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Engine (Right) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#8B0000] uppercase tracking-widest bg-[#FDFCF8] px-3 py-1 rounded-sm border border-[#D4AF37]/40">
                {product.categoryName}
              </span>
              <span className="text-[11px] text-[#777777] font-medium">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#333333] mt-3 leading-snug">
              {product.title}
            </h1>

            {/* Ratings & Verified Badge */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-[#333333] bg-[#FDFCF8] px-2.5 py-1 rounded-md border border-[#E5E1D8]">
                <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="font-bold text-sm">{product.rating}</span>
                <span className="text-[#777777]">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                <PackageCheck className="w-4 h-4" />
                {product.inStock ? `${product.stockQuantity} In Stock` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-lg bg-[#FDFCF8] border border-[#E5E1D8] flex items-baseline gap-4">
            <span className="text-3xl font-bold text-[#8B0000]">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-[#888888] line-through font-medium">
                M.R.P: ₹{product.originalPrice}
              </span>
            )}
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
              Save ₹{product.originalPrice - product.price} ({product.discountPercent}%)
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Variant Selector (if available) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-[#333333] uppercase tracking-wider">
                Select {product.variants[0].name}:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-4 py-2 rounded-md text-xs font-bold border transition-all ${
                      selectedVariant === opt
                        ? 'bg-[#8B0000] text-white border-[#8B0000]'
                        : 'bg-white text-[#555555] border-[#E5E1D8] hover:border-[#8B0000]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-md border border-[#E5E1D8] bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-sm font-bold text-[#555555] hover:bg-[#FDFCF8]"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-[#333333]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2 text-sm font-bold text-[#555555] hover:bg-[#FDFCF8]"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-3 px-6 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs ${
                  !product.inStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : addedAnim
                    ? 'bg-green-700 text-white'
                    : 'bg-[#8B0000] hover:bg-[#700000] text-white'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-md border transition-colors shadow-2xs ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-[#E5E1D8] text-[#555555] hover:text-[#8B0000]'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-[#8B0000] text-[#8B0000]' : ''}`} />
              </button>
            </div>

            {/* Direct Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full py-3 rounded-md bg-[#D4AF37] hover:bg-[#c29d2b] text-[#1A1A1A] font-bold text-xs tracking-wider uppercase transition-all shadow-2xs flex items-center justify-center gap-2"
            >
              <span>Instant Buy Now</span>
              <Sparkles className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="p-4 rounded-lg bg-white border border-[#E5E1D8] space-y-2.5 text-xs text-[#555555]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#8B0000] shrink-0" />
              <span>Free express delivery on festive orders over ₹999</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#8B0000] shrink-0" />
              <span>7-Day transit damage guarantee with instant photo claim</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span className="font-semibold text-green-800">100% Non-hazardous, safe & lawful celebration item</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Description, Specs, Artisan, Reviews) */}
      <div className="bg-white rounded-lg border border-[#E5E1D8] p-6 sm:p-8 shadow-2xs">
        {/* Tab Headers */}
        <div className="flex border-b border-[#E5E1D8] gap-6 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'desc' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#777777] hover:text-[#333333]'
            }`}
          >
            Description & Significance
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'specs' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#777777] hover:text-[#333333]'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('artisan')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'artisan' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#777777] hover:text-[#333333]'
            }`}
          >
            Artisan & Sourcing
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wide transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'reviews' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-[#777777] hover:text-[#333333]'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="text-xs sm:text-sm text-[#555555] space-y-4 leading-relaxed max-w-3xl">
              <p>{product.description}</p>
              <div className="p-4 rounded-md bg-[#FDFCF8] border border-[#E5E1D8]">
                <h4 className="font-serif font-bold text-xs text-[#8B0000] uppercase tracking-wider mb-1">
                  Festive Significance:
                </h4>
                <p className="text-xs text-[#666666]">
                  Lighting diyas and offering prayers with brass articles invites spiritual light, disperses darkness, and attracts auspicious blessings of harmony and wellness into the home.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <table className="w-full text-xs text-left">
                <tbody className="divide-y divide-[#E5E1D8]">
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <tr key={key} className="py-2.5">
                      <td className="py-2.5 font-bold text-[#333333] w-1/3">{key}</td>
                      <td className="py-2.5 text-[#555555]">{val}</td>
                    </tr>
                  ))}
                  <tr className="py-2.5">
                    <td className="py-2.5 font-bold text-[#333333]">Compliance & Safety</td>
                    <td className="py-2.5 text-green-700 font-medium">{product.safetyCompliance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'artisan' && (
            <div className="max-w-2xl space-y-4 text-xs sm:text-sm text-[#555555]">
              <div className="p-4 rounded-md bg-[#FDFCF8] border border-[#E5E1D8]">
                <h4 className="font-serif font-bold text-sm text-[#8B0000] mb-1">Handmade by Certified Rural Crafts Guilds</h4>
                <p className="text-xs leading-relaxed text-[#666666]">
                  {product.artisanInfo || 'Directly handcrafted by master traditional artisans under fair-trade principles. Your purchase helps preserve historic Indian artforms and empowers artisan clusters.'}
                </p>
              </div>
              <p className="text-xs leading-relaxed">
                By maintaining direct partnerships with potters, brass casters, and weavers, Utsav Veda ensures fair wages, dignity of labor, and genuine cultural preservation.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map(rev => (
                    <div key={rev.id} className="p-4 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#333333]">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="text-[10px] text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-sm border border-green-200">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                          ))}
                        </div>
                      </div>
                      <h5 className="font-serif font-bold text-xs text-[#8B0000]">{rev.title}</h5>
                      <p className="text-xs text-[#555555] leading-relaxed">{rev.comment}</p>
                      <p className="text-[10px] text-[#888888]">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#666666]">Be the first to review this festive item!</p>
                )}
              </div>

              {/* Submit a Review Form */}
              <div className="p-6 rounded-md bg-[#FDFCF8] border border-[#E5E1D8] max-w-xl">
                <h4 className="font-serif text-sm font-bold text-[#8B0000] mb-1">Write a Review</h4>
                <p className="text-xs text-[#666666] mb-4">Share your festive experience with other buyers.</p>

                {revSuccess && (
                  <div className="mb-3 p-3 rounded-md bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>{revSuccess}</span>
                  </div>
                )}

                {revError && (
                  <div className="mb-3 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>{revError}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Your Rating</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= revRating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={e => setRevName(e.target.value)}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full px-3 py-2 text-xs bg-white rounded-md border border-[#E5E1D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Review Headline</label>
                    <input
                      type="text"
                      required
                      value={revTitle}
                      onChange={e => setRevTitle(e.target.value)}
                      placeholder="e.g. Beautiful quality brass diya!"
                      className="w-full px-3 py-2 text-xs bg-white rounded-md border border-[#E5E1D8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#333333] mb-1">Your Comments</label>
                    <textarea
                      rows={3}
                      required
                      value={revComment}
                      onChange={e => setRevComment(e.target.value)}
                      placeholder="Describe how it looked in your home or celebration..."
                      className="w-full px-3 py-2 text-xs bg-white rounded-md border border-[#E5E1D8]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingRev}
                    className="px-5 py-2.5 rounded-md bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-bold flex items-center gap-2 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingRev ? 'Submitting...' : 'Post Verified Review'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#333333]">
              Complementary Festive Items
            </h2>
            <button
              onClick={() => onNavigate('shop', { categorySlug: product.categoryId })}
              className="text-xs font-bold text-[#8B0000] hover:underline"
            >
              View More in Category →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={(id) => onNavigate('product-detail', { productId: id })}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
