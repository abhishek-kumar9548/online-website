import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product } from '../types.ts';
import { useCart } from '../context/CartContext.tsx';
import { useWishlist } from '../context/WishlistContext.tsx';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
  onQuickView: (product: Product) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect, 
  onQuickView, 
  layout = 'grid' 
}) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedAnim, setAddedAnim] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1400);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  if (layout === 'list') {
    return (
      <div 
        id={`product-card-${product.id}`}
        onClick={() => onSelect(product.id)}
        className="group bg-white rounded-xl border border-[#E5E1D8] hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col sm:flex-row cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="sm:w-52 h-48 sm:h-auto relative overflow-hidden bg-[#F5F2EA] shrink-0 border-b sm:border-b-0 sm:border-r border-[#E5E1D8]">
          <img
            src={product.images[imageIdx] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discountPercent > 0 && (
            <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Best Seller
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                <span className="font-bold text-xs text-[#333333]">{product.rating}</span>
                <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="text-[14px] font-semibold text-[#333333] group-hover:text-[#8B0000] transition-colors mt-1 font-serif">
              {product.title}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-2 mt-1.5 leading-relaxed">
              {product.shortDescription}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5E1D8] flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[15px] font-bold text-[#8B0000]">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-[11px] text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>
              <span className="text-[10px] text-green-700 font-medium">
                Save ₹{product.originalPrice - product.price}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg border transition-colors ${
                  isFavorited 
                    ? 'bg-rose-50 border-rose-200 text-rose-600' 
                    : 'bg-[#F5F2EA] border-[#E5E1D8] text-gray-600 hover:text-[#8B0000]'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleQuickView}
                className="p-2 rounded-lg bg-[#F5F2EA] border border-[#E5E1D8] text-gray-600 hover:text-[#8B0000] transition-colors"
                title="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs ${
                  addedAnim 
                    ? 'bg-green-700 text-white' 
                    : 'bg-[#8B0000] hover:bg-[#700000] text-white'
                }`}
              >
                {addedAnim ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product.id)}
      onMouseEnter={() => { if (product.images.length > 1) setImageIdx(1); }}
      onMouseLeave={() => setImageIdx(0)}
      className="group bg-white rounded-xl border border-[#E5E1D8] hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Product Image Stage */}
      <div className="aspect-square w-full relative overflow-hidden bg-[#F5F2EA] flex items-center justify-center border-b border-[#E5E1D8]">
        <img
          src={product.images[imageIdx] || product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        {product.isBestSeller && (
          <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">
            Best Seller
          </span>
        )}
        {product.discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider z-10">
            {product.discountPercent}% OFF
          </span>
        )}

        {/* Wishlist quick toggle button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute ${product.discountPercent > 0 ? 'top-8' : 'top-2'} right-2 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs border border-[#E5E1D8] transition-all hover:bg-white`}
          title="Add to Wishlist"
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-gray-500 hover:text-[#8B0000]'}`} />
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-white text-[#333333] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}

        {/* Sleek Slide-up Action Bar */}
        <div className="absolute bottom-0 w-full bg-white/95 backdrop-blur-xs py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-center items-center space-x-3 border-t border-[#E5E1D8] z-20 shadow-xs">
          <button
            type="button"
            onClick={handleQuickView}
            className="text-[10px] font-bold uppercase tracking-tight text-gray-700 hover:text-[#8B0000] transition-colors"
          >
            Quick View
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${
              !product.inStock 
                ? 'text-gray-400 cursor-not-allowed' 
                : addedAnim 
                ? 'text-green-700' 
                : 'text-[#8B0000] hover:text-[#b45309]'
            }`}
          >
            {addedAnim ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Product Info Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-[#8B0000] font-bold uppercase tracking-widest">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-[#D4AF37]">
              <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-bold text-[#333333] text-[11px]">{product.rating}</span>
              <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[13px] font-medium text-[#333333] group-hover:text-[#8B0000] transition-colors line-clamp-2 leading-snug">
            {product.title}
          </h3>
        </div>

        {/* Pricing & Inline Add */}
        <div className="mt-2.5 pt-2 border-t border-[#E5E1D8] flex items-center justify-between">
          <div className="flex items-baseline">
            <span className="text-[14px] font-bold text-[#8B0000]">₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through font-normal ml-1.5">₹{product.originalPrice}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
              !product.inStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : addedAnim
                ? 'bg-green-700 text-white'
                : 'bg-[#F5F2EA] text-[#8B0000] hover:bg-[#8B0000] hover:text-white border border-[#E5E1D8]'
            }`}
          >
            {addedAnim ? (
              <>
                <Check className="w-3 h-3" />
                <span>Done</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
