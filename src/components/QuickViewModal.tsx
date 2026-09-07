import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onViewFullDetail: (productId: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ 
  product, 
  onClose, 
  onViewFullDetail 
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(() => {
    return product?.variants?.[0]?.options?.[0] || '';
  });
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white text-[#333333] max-w-3xl w-full rounded-lg shadow-2xl border border-[#E5E1D8] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#555555] flex items-center justify-center shadow-2xs border border-[#E5E1D8] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery side */}
          <div className="p-6 bg-[#FDFCF8] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E5E1D8]">
            <div className="aspect-square w-full rounded-md overflow-hidden bg-white border border-[#E5E1D8]">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-14 rounded-md overflow-hidden border transition-all shrink-0 ${
                      activeImageIdx === idx ? 'border-[#8B0000] shadow-2xs' : 'border-[#E5E1D8] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="p-6 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-[#8B0000] uppercase tracking-wider bg-[#FDFCF8] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-sm">
                  {product.categoryName}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-700">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#777777]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif text-xl font-bold text-[#333333] mt-3 leading-snug">
                {product.title}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-[#8B0000]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-[#888888] line-through">₹{product.originalPrice}</span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs bg-[#8B0000] text-white font-bold px-2 py-0.5 rounded-sm">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              <p className="text-xs text-[#555555] mt-3 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E5E1D8]">
                  <p className="text-xs font-bold text-[#333333] mb-2">
                    {product.variants[0].name}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants[0].options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSelectedVariant(opt)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                          selectedVariant === opt
                            ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-2xs'
                            : 'bg-white text-[#555555] border-[#E5E1D8] hover:border-[#8B0000]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-bold text-[#333333]">Quantity:</span>
                <div className="flex items-center rounded-md border border-[#E5E1D8] bg-white overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-sm font-bold text-[#555555] hover:bg-[#FDFCF8]"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#333333]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-sm font-bold text-[#555555] hover:bg-[#FDFCF8]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 pt-4 border-t border-[#E5E1D8] space-y-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-2.5 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs ${
                    added ? 'bg-green-700 text-white' : 'bg-[#8B0000] hover:bg-[#700000] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 rounded-md border transition-colors ${
                    isFavorited
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-[#E5E1D8] text-[#555555] hover:text-[#8B0000]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-green-800 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                  100% Lawful & Age-appropriate
                </span>

                <button
                  onClick={() => {
                    onClose();
                    onViewFullDetail(product.id);
                  }}
                  className="text-xs font-semibold text-[#8B0000] hover:underline flex items-center gap-1"
                >
                  <span>Full product page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
