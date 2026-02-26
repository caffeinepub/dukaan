import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Plus, Search, SlidersHorizontal, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ProductCard from '../components/products/ProductCard';
import { useProducts, useToggleShortlist } from '../hooks/useQueries';

export default function ProductList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const { data: products = [], isLoading } = useProducts();
  const toggleShortlist = useToggleShortlist();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    return cats.sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  const handleToggleShortlist = async (id: bigint) => {
    try {
      await toggleShortlist.mutateAsync(id);
      const product = products.find((p) => p.id === id);
      toast.success(product?.isShortlisted ? 'Removed from shortlist' : 'Added to shortlist');
    } catch {
      toast.error('Failed to update shortlist');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-foreground">My Products</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full font-body">
            {filtered.length} items
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border rounded-xl font-body text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-muted-foreground flex-shrink-0" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1 bg-card border-border rounded-xl font-body text-sm h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 pb-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50">
                <Skeleton className="h-32 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Package size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">No Products Found</h3>
            <p className="text-sm text-muted-foreground font-body mb-4">
              {search || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first product to get started'}
            </p>
            {!search && categoryFilter === 'all' && (
              <button
                onClick={() => navigate({ to: '/products/new' })}
                className="gradient-saffron text-ivory font-body font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm"
              >
                Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onToggleShortlist={handleToggleShortlist}
                isShortlistPending={toggleShortlist.isPending}
              />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate({ to: '/products/new' })}
        className="fixed bottom-24 right-4 w-14 h-14 gradient-saffron rounded-full shadow-lg flex items-center justify-center z-30 hover:scale-105 transition-transform"
      >
        <Plus size={24} className="text-ivory" />
      </button>
    </div>
  );
}
