import { useNavigate } from '@tanstack/react-router';
import { TrendingUp, Flame, Package } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ProductCard from '../components/products/ProductCard';
import { useTrendingProducts, useToggleShortlist } from '../hooks/useQueries';

export default function TrendingProducts() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useTrendingProducts();
  const toggleShortlist = useToggleShortlist();

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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 gradient-saffron rounded-xl flex items-center justify-center shadow-sm">
            <Flame size={20} className="text-ivory" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Trending Now</h2>
            <p className="text-xs text-muted-foreground font-body">Hot selling products</p>
          </div>
        </div>

        {/* Banner */}
        <div className="gradient-saffron rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-sm">
          <TrendingUp size={24} className="text-ivory flex-shrink-0" />
          <div>
            <p className="font-display font-bold text-ivory text-sm">
              {products.length} Trending Product{products.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-ivory/80 font-body">
              Mark products as trending from their detail page
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
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
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <TrendingUp size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">No Trending Products</h3>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Mark products as trending from their detail page
            </p>
            <button
              onClick={() => navigate({ to: '/products' })}
              className="gradient-saffron text-ivory font-body font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.id.toString()} className="relative">
                {/* Trending Badge Overlay */}
                <div className="absolute top-0 left-0 right-0 z-10 flex justify-center -translate-y-0">
                  <span className="gradient-saffron text-ivory text-[10px] font-bold px-3 py-0.5 rounded-b-lg shadow-sm flex items-center gap-1">
                    <Flame size={9} />
                    TRENDING
                  </span>
                </div>
                <ProductCard
                  product={product}
                  onToggleShortlist={handleToggleShortlist}
                  isShortlistPending={toggleShortlist.isPending}
                  showTrendingBadge={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
