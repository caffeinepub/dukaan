import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { useNavigate as useNav } from "@tanstack/react-router";
import { Bookmark, BookmarkX, Package } from "lucide-react";
import { IndianRupee, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend";
import {
  useShortlistedProducts,
  useToggleShortlist,
} from "../hooks/useQueries";

interface ShortlistCardProps {
  product: Product;
  onRemove: (id: bigint) => void;
  isRemoving: boolean;
}

function ShortlistCard({ product, onRemove, isRemoving }: ShortlistCardProps) {
  const navigate = useNav();
  const isLowStock = Number(product.stock) < 10;

  return (
    <div className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden card-hover">
      <button
        type="button"
        className="cursor-pointer w-full text-left"
        onClick={() =>
          navigate({
            to: "/products/$productId",
            params: { productId: product.id.toString() },
          })
        }
      >
        {/* Image */}
        <div className="relative h-28 bg-muted overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron/10 to-maroon/10">
              <Package size={28} className="text-muted-foreground/40" />
            </div>
          )}
          {product.isTrending && (
            <span className="absolute top-2 left-2 flex items-center gap-0.5 bg-saffron text-ivory text-[10px] font-bold px-2 py-0.5 rounded-full">
              <TrendingUp size={9} /> Hot
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-3 pb-2">
          <p className="text-[10px] font-body font-semibold text-saffron-dark uppercase tracking-wider mb-0.5">
            {product.category}
          </p>
          <h3 className="font-display font-bold text-sm text-foreground leading-tight line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-0.5">
              <IndianRupee size={12} className="text-maroon" />
              <span className="font-display font-bold text-sm text-maroon">
                {Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>
            <Badge
              variant={isLowStock ? "destructive" : "secondary"}
              className="text-[10px] px-1.5 py-0"
            >
              {Number(product.stock)} units
            </Badge>
          </div>
        </div>
      </button>

      {/* Remove Button */}
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          disabled={isRemoving}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-maroon/10 text-maroon hover:bg-maroon/20 transition-colors font-body font-semibold text-xs disabled:opacity-50"
        >
          <BookmarkX size={13} />
          Remove from Shortlist
        </button>
      </div>
    </div>
  );
}

export default function Shortlist() {
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useShortlistedProducts();
  const toggleShortlist = useToggleShortlist();

  const handleRemove = async (id: bigint) => {
    try {
      await toggleShortlist.mutateAsync(id);
      toast.success("Removed from shortlist");
    } catch {
      toast.error("Failed to remove from shortlist");
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 gradient-maroon rounded-xl flex items-center justify-center shadow-sm">
            <Bookmark size={20} className="text-ivory" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              My Shortlist
            </h2>
            <p className="text-xs text-muted-foreground font-body">
              {products.length} saved product{products.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 pb-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {["a", "b", "c", "d"].map((k) => (
              <div
                key={`skeleton-shortlist-${k}`}
                className="bg-card rounded-2xl overflow-hidden shadow-card border border-border/50"
              >
                <Skeleton className="h-28 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Bookmark size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">
              No Shortlisted Products
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-4">
              Save products you want to track quickly
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/products" })}
              className="gradient-maroon text-ivory font-body font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ShortlistCard
                key={product.id.toString()}
                product={product}
                onRemove={handleRemove}
                isRemoving={toggleShortlist.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
