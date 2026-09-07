import React, { useState, useEffect } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Grid, 
  List, 
  Star, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { Product, Category } from '../types.ts';
import { api } from '../services/api.ts';
import { ProductCard } from '../components/ProductCard.tsx';

interface ShopPageProps {
  initialCategorySlug?: string;
  initialSearch?: string;
  onSelectProduct: (id: string) => void;
  onQuickView: (product: Product) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  initialCategorySlug, 
  initialSearch, 
  onSelectProduct, 
  onQuickView 
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || '');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const limit = 9;

  // Load categories
  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories)).catch(() => {});
  }, []);

  // Sync prop changes
  useEffect(() => {
    if (initialCategorySlug !== undefined) setSelectedCategory(initialCategorySlug);
    if (initialSearch !== undefined) setSearch(initialSearch);
  }, [initialCategorySlug, initialSearch]);

  // Load products when filters change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let minPrice: number | undefined;
      let maxPrice: number | undefined;

      if (priceRange === 'under-500') {
        maxPrice = 500;
      } else if (priceRange === '500-1500') {
        minPrice = 500;
        maxPrice = 1500;
      } else if (priceRange === 'above-1500') {
        minPrice = 1500;
      }

      try {
        const offset = (currentPage - 1) * limit;
        const res = await api.getProducts({
          categorySlug: selectedCategory || undefined,
          search: search.trim() || undefined,
          minPrice,
          maxPrice,
          rating: minRating || undefined,
          inStockOnly,
          sort: sortBy,
          limit,
          offset
        });
        setProducts(res.products);
        setTotal(res.total);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, search, priceRange, minRating, inStockOnly, sortBy, currentPage]);

  const totalPages = Math.ceil(total / limit) || 1;

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange('all');
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('popularity');
    setCurrentPage(1);
  };

  const hasActiveFilters = !!(search || selectedCategory || priceRange !== 'all' || minRating > 0 || inStockOnly);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Breadcrumbs & Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-[#777777] mb-2">
          <span>Home</span>
          <span>/</span>
          <span className="font-semibold text-[#8B0000]">Festive Store</span>
          {selectedCategory && (
            <>
              <span>/</span>
              <span className="font-semibold text-[#333333] capitalize">
                {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#333333]">
              {selectedCategory 
                ? categories.find(c => c.slug === selectedCategory)?.name || 'Festive Collection'
                : 'All Festival Products & Essentials'
              }
            </h1>
            <p className="text-xs text-[#666666] mt-1">
              Showing {products.length} of {total} verified lawful & artisanal items
            </p>
          </div>

          {/* Controls: Sort and View Mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold text-[#333333] flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#8B0000]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#666666] font-medium hidden sm:inline">Sort By:</span>
              <select
                id="shop-sort-dropdown"
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
                className="px-3 py-2 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold text-[#333333] focus:outline-hidden focus:border-[#8B0000]"
              >
                <option value="popularity">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>

            {/* Grid/List View Toggles */}
            <div className="hidden sm:flex rounded-md bg-white border border-[#E5E1D8] p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'grid' ? 'bg-[#8B0000] text-white' : 'text-[#777777] hover:text-[#333333]'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-[#8B0000] text-white' : 'text-[#777777] hover:text-[#333333]'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#777777] font-semibold">Active Filters:</span>
          {search && (
            <span className="px-2.5 py-1 rounded-full bg-white text-[#8B0000] font-semibold flex items-center gap-1 border border-[#D4AF37]/50 shadow-2xs">
              Keyword: "{search}"
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSearch('')} />
            </span>
          )}
          {selectedCategory && (
            <span className="px-2.5 py-1 rounded-full bg-white text-[#8B0000] font-semibold flex items-center gap-1 border border-[#D4AF37]/50 shadow-2xs">
              Category: {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedCategory('')} />
            </span>
          )}
          {priceRange !== 'all' && (
            <span className="px-2.5 py-1 rounded-full bg-white text-[#8B0000] font-semibold flex items-center gap-1 border border-[#D4AF37]/50 shadow-2xs">
              Price: {priceRange}
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setPriceRange('all')} />
            </span>
          )}
          {minRating > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-white text-[#8B0000] font-semibold flex items-center gap-1 border border-[#D4AF37]/50 shadow-2xs">
              Rating: {minRating}★ & above
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setMinRating(0)} />
            </span>
          )}
          {inStockOnly && (
            <span className="px-2.5 py-1 rounded-full bg-white text-[#8B0000] font-semibold flex items-center gap-1 border border-[#D4AF37]/50 shadow-2xs">
              In Stock Only
              <X className="w-3.5 h-3.5 cursor-pointer" onClick={() => setInStockOnly(false)} />
            </span>
          )}
          <button
            onClick={resetAllFilters}
            className="text-[11px] text-[#8B0000] hover:underline font-bold flex items-center gap-1 ml-2"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white p-5 rounded-lg border border-[#E5E1D8] shadow-2xs space-y-6 sticky top-28">
            
            {/* Live Search in shop */}
            <div>
              <label className="block text-xs font-bold text-[#333333] mb-2 uppercase tracking-wider">
                Search Items
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="e.g. Diya, Thali, Brass..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-md bg-[#FDFCF8] border border-[#E5E1D8] focus:outline-hidden focus:border-[#8B0000]"
                />
                <Search className="w-3.5 h-3.5 text-[#888888] absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-[#333333] mb-3 uppercase tracking-wider">
                Festive Categories
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => { setSelectedCategory(''); setCurrentPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors font-medium flex justify-between items-center ${
                    selectedCategory === '' ? 'bg-[#8B0000] text-white font-bold' : 'text-[#555555] hover:bg-[#FDFCF8]'
                  }`}
                >
                  <span>All Categories</span>
                  <span className={`text-[10px] ${selectedCategory === '' ? 'text-white/80' : 'text-[#888888]'}`}>{total}</span>
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors font-medium flex justify-between items-center ${
                      selectedCategory === cat.slug ? 'bg-[#8B0000] text-white font-bold' : 'text-[#555555] hover:bg-[#FDFCF8]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] ${selectedCategory === cat.slug ? 'text-white/80' : 'text-[#888888]'}`}>{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="pt-4 border-t border-[#E5E1D8]">
              <h3 className="text-xs font-bold text-[#333333] mb-3 uppercase tracking-wider">
                Price Range
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'All Prices', val: 'all' },
                  { label: 'Under ₹500', val: 'under-500' },
                  { label: '₹500 - ₹1,500', val: '500-1500' },
                  { label: 'Above ₹1,500', val: 'above-1500' },
                ].map(p => (
                  <label key={p.val} className="flex items-center gap-2 cursor-pointer text-[#555555]">
                    <input
                      type="radio"
                      name="price"
                      checked={priceRange === p.val}
                      onChange={() => { setPriceRange(p.val); setCurrentPage(1); }}
                      className="accent-[#8B0000]"
                    />
                    <span>{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Customer Rating Filter */}
            <div className="pt-4 border-t border-[#E5E1D8]">
              <h3 className="text-xs font-bold text-[#333333] mb-3 uppercase tracking-wider">
                Customer Rating
              </h3>
              <div className="space-y-1.5 text-xs">
                {[
                  { label: 'All Ratings', stars: 0 },
                  { label: '4★ & Above', stars: 4 },
                  { label: '4.5★ & Above', stars: 4.5 },
                ].map(r => (
                  <button
                    key={r.stars}
                    onClick={() => { setMinRating(r.stars); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-md flex items-center gap-2 ${
                      minRating === r.stars ? 'bg-[#FDFCF8] text-[#8B0000] font-bold border border-[#D4AF37]' : 'text-[#555555] hover:bg-[#FDFCF8]'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Only Checkbox */}
            <div className="pt-4 border-t border-[#E5E1D8]">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#333333]">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => { setInStockOnly(e.target.checked); setCurrentPage(1); }}
                  className="rounded text-[#8B0000] accent-[#8B0000]"
                />
                <span>In Stock Ready to Ship</span>
              </label>
            </div>

          </div>
        </aside>

        {/* Product Cards Grid & Pagination */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 bg-white rounded-lg border border-[#E5E1D8] animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {products.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout={viewMode}
                    onSelect={onSelectProduct}
                    onQuickView={onQuickView}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="p-2 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold text-[#555555] disabled:opacity-40 hover:bg-[#FDFCF8]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-md text-xs font-bold transition-all ${
                        currentPage === page 
                          ? 'bg-[#8B0000] text-white shadow-2xs' 
                          : 'bg-white border border-[#E5E1D8] text-[#555555] hover:bg-[#FDFCF8]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="p-2 rounded-md bg-white border border-[#E5E1D8] text-xs font-bold text-[#555555] disabled:opacity-40 hover:bg-[#FDFCF8]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center border border-[#E5E1D8] space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#FDFCF8] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#8B0000]">
                <Sparkles className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#333333]">
                No Festival Products Match Your Filters
              </h3>
              <p className="text-xs text-[#666666] max-w-sm mx-auto">
                Try widening your price range, searching for another keyword, or exploring all available categories.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-2.5 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-[#FDFCF8] w-full max-w-xs h-full p-6 overflow-y-auto space-y-6 border-l border-[#E5E1D8]">
            <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-4">
              <h3 className="font-serif text-lg font-bold text-[#8B0000]">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#555555]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Category Select */}
            <div>
              <p className="text-xs font-bold text-[#333333] mb-2 uppercase">Category</p>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="w-full p-2.5 text-xs bg-white rounded-md border border-[#E5E1D8]"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Price Select */}
            <div>
              <p className="text-xs font-bold text-[#333333] mb-2 uppercase">Price Range</p>
              <select
                value={priceRange}
                onChange={(e) => { setPriceRange(e.target.value); setCurrentPage(1); }}
                className="w-full p-2.5 text-xs bg-white rounded-md border border-[#E5E1D8]"
              >
                <option value="all">All Prices</option>
                <option value="under-500">Under ₹500</option>
                <option value="500-1500">₹500 - ₹1,500</option>
                <option value="above-1500">Above ₹1,500</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 rounded-md bg-[#8B0000] text-white text-xs font-bold hover:bg-[#700000]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
