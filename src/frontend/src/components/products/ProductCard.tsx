import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, Package, TrendingUp } from "lucide-react";
import type { Product } from "../../backend";

interface ProductCardProps {
  product: Product;
  onToggleShortlist?: (id: bigint) => void;
  isShortlistPending?: boolean;
  showTrendingBadge?: boolean;
}

export default function ProductCard({
  product,
  onToggleShortlist,
  isShortlistPending,
  showTrendingBadge = true,
}: ProductCardProps) {
  const navigate = useNavigate();
  const isLowStock = Number(product.stock) < 10;
  const hasDiscount = Number(product.discountPercent) > 0;

  return (
    <button
      type="button"
      className="bg-card rounded-2xl shadow-card border border-border/50 overflow-hidden card-hover cursor-pointer text-left w-full"
      onClick={() =>
        navigate({
          to: "/products/$productId",
          params: { productId: product.id.toString() },
        })
      }
    >
      {/* Product Image */}
      <div className="relative h-32 bg-muted overflow-hidden">
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
            <Package size={32} className="text-muted-foreground/40" />
          </div>
        )}
        {/* Left Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {showTrendingBadge && product.isTrending && (
            <span className="flex items-center gap-0.5 bg-saffron text-ivory text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              <TrendingUp size={10} />
              Hot
            </span>
          )}
          {isLowStock && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Low Stock
            </span>
          )}
        </div>
        {/* Discount Badge - top right */}
        {hasDiscount && (
          <div className="absolute top-2 right-8">
            <span className="bg-saffron text-ivory text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
              {Number(product.discountPercent)}% OFF
            </span>
          </div>
        )}
        {/* Shortlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleShortlist?.(product.id);
          }}
          disabled={isShortlistPending}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 shadow flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50"
        >
          {product.isShortlisted ? (
            <BookmarkCheck size={14} className="text-maroon" />
          ) : (
            <Bookmark size={14} className="text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3">
        <p className="text-[10px] font-body font-semibold text-saffron-dark uppercase tracking-wider mb-0.5">
          {product.category}
        </p>
        <h3 className="font-display font-bold text-sm text-foreground leading-tight line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-base text-maroon">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            {hasDiscount && Number(product.mrp) > 0 && (
              <span className="font-body text-xs text-muted-foreground line-through">
                ₹{Number(product.mrp).toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <Badge
            variant={isLowStock ? "destructive" : "secondary"}
            className="text-[10px] px-1.5 py-0"
          >
            {Number(product.stock)} units
          </Badge>
        </div>
        {product.unit?.trim() && (
          <p className="text-[10px] text-muted-foreground font-body mt-0.5">
            {product.unit}
          </p>
        )}
      </div>
    </button>
  );
}
