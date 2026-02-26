import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Save, Loader2, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useProducts, useLowStockProducts, useUpdateStockQuantity } from '../hooks/useQueries';
import type { Product } from '../backend';

const LOW_STOCK_THRESHOLD = 10;

interface StockRowProps {
  product: Product;
  onSave: (id: bigint, newStock: number) => Promise<void>;
  isSaving: boolean;
}

function StockRow({ product, onSave, isSaving }: StockRowProps) {
  const [qty, setQty] = useState(Number(product.stock));
  const [isDirty, setIsDirty] = useState(false);
  const isLow = Number(product.stock) < LOW_STOCK_THRESHOLD;

  useEffect(() => {
    setQty(Number(product.stock));
    setIsDirty(false);
  }, [product.stock]);

  const handleChange = (val: string) => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 0) {
      setQty(num);
      setIsDirty(num !== Number(product.stock));
    }
  };

  const handleSave = async () => {
    await onSave(product.id, qty);
    setIsDirty(false);
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
      isLow
        ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30'
        : 'bg-card border-border/50'
    }`}>
      {/* Status Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isLow ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'
      }`}>
        {isLow ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <p className="font-body font-semibold text-sm text-foreground truncate">{product.name}</p>
        <p className="text-xs text-muted-foreground font-body">{product.category}</p>
      </div>

      {/* Stock Input */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Input
          type="number"
          value={qty}
          onChange={(e) => handleChange(e.target.value)}
          min="0"
          className={`w-20 h-8 text-center rounded-lg font-body text-sm font-semibold ${
            isLow ? 'border-red-300 text-red-600' : ''
          }`}
        />
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isDirty && !isSaving
              ? 'bg-saffron text-ivory shadow-sm hover:bg-saffron-dark'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
        </button>
      </div>
    </div>
  );
}

export default function StockManagement() {
  const { data: products = [], isLoading } = useProducts();
  const { data: lowStockProducts = [] } = useLowStockProducts();
  const updateStock = useUpdateStockQuantity();
  const [savingId, setSavingId] = useState<bigint | null>(null);

  const handleSave = async (id: bigint, newStock: number) => {
    setSavingId(id);
    try {
      await updateStock.mutateAsync({ productId: id, newStock: BigInt(newStock) });
      toast.success('Stock updated!');
    } catch {
      toast.error('Failed to update stock');
    } finally {
      setSavingId(null);
    }
  };

  const sortedProducts = [...products].sort((a, b) => Number(a.stock) - Number(b.stock));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h2 className="font-display text-xl font-bold text-foreground mb-4">Stock Management</h2>

        {/* Summary Banner */}
        {lowStockProducts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3 dark:bg-red-950/20 dark:border-red-800/30">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <p className="font-display font-bold text-red-700 dark:text-red-400">
                {lowStockProducts.length} Low Stock Alert{lowStockProducts.length > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-red-600/80 font-body dark:text-red-400/80">
                Items below {LOW_STOCK_THRESHOLD} units need restocking
              </p>
            </div>
          </div>
        )}

        {!isLoading && lowStockProducts.length === 0 && products.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-center gap-3 dark:bg-green-950/20 dark:border-green-800/30">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-display font-bold text-green-700 dark:text-green-400">All Stock Healthy</p>
              <p className="text-xs text-green-600/80 font-body dark:text-green-400/80">
                All products are above the {LOW_STOCK_THRESHOLD} unit threshold
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-card rounded-xl p-3 text-center border border-border/50">
            <p className="font-display font-bold text-lg text-foreground">{products.length}</p>
            <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wide">Total</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3 text-center border border-red-200 dark:bg-red-950/20 dark:border-red-800/30">
            <p className="font-display font-bold text-lg text-red-600">{lowStockProducts.length}</p>
            <p className="text-[10px] text-red-500 font-body uppercase tracking-wide">Low Stock</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200 dark:bg-green-950/20 dark:border-green-800/30">
            <p className="font-display font-bold text-lg text-green-600">{products.length - lowStockProducts.length}</p>
            <p className="text-[10px] text-green-600 font-body uppercase tracking-wide">Healthy</p>
          </div>
        </div>
      </div>

      {/* Stock List */}
      <div className="px-4 pb-4 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))
        ) : sortedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <BarChart3 size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">No Products Yet</h3>
            <p className="text-sm text-muted-foreground font-body">Add products to manage their stock levels</p>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <StockRow
              key={product.id.toString()}
              product={product}
              onSave={handleSave}
              isSaving={savingId === product.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
