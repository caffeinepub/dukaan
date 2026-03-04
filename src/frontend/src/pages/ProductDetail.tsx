import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Edit,
  IndianRupee,
  Package,
  Ruler,
  Shield,
  Tag,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  useDeleteProduct,
  useProductById,
  useSetTrending,
  useToggleShortlist,
} from "../hooks/useQueries";

export default function ProductDetail() {
  const { productId } = useParams({ from: "/products/$productId" });
  const navigate = useNavigate();
  const id = BigInt(productId);

  const { data: product, isLoading, error } = useProductById(id);
  const deleteProduct = useDeleteProduct();
  const setTrending = useSetTrending();
  const toggleShortlist = useToggleShortlist();

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
      navigate({ to: "/products" });
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleTrending = async () => {
    if (!product) return;
    try {
      await setTrending.mutateAsync({
        productId: id,
        isTrending: !product.isTrending,
      });
      toast.success(
        product.isTrending ? "Removed from trending" : "Marked as trending",
      );
    } catch {
      toast.error("Failed to update trending status");
    }
  };

  const handleToggleShortlist = async () => {
    if (!product) return;
    try {
      await toggleShortlist.mutateAsync(id);
      toast.success(
        product.isShortlisted ? "Removed from shortlist" : "Added to shortlist",
      );
    } catch {
      toast.error("Failed to update shortlist");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="px-4 pt-4">
          <Skeleton className="h-8 w-8 rounded-xl mb-4" />
          <Skeleton className="h-48 w-full rounded-2xl mb-4" />
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate({ to: "/products" })}
          className="flex items-center gap-2 text-muted-foreground mb-4"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center py-16">
          <p className="text-destructive font-body">Product not found</p>
        </div>
      </div>
    );
  }

  const isLowStock = Number(product.stock) < 10;
  const hasMrp = Number(product.mrp) > 0;
  const hasWholesale = Number(product.wholesalePrice) > 0;
  const hasDiscount = Number(product.discountPercent) > 0;
  const hasUnit = product.unit && product.unit.trim().length > 0;
  const hasAmenities = product.amenities && product.amenities.length > 0;
  const hasTags = product.tags && product.tags.length > 0;
  const hasWarranty = product.warranty && product.warranty.trim().length > 0;

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate({ to: "/products" })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-body text-sm font-medium">Products</span>
        </button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9 rounded-xl"
            onClick={() =>
              navigate({
                to: "/products/$productId/edit",
                params: { productId: productId },
              })
            }
          >
            <Edit size={15} />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="w-9 h-9 rounded-xl"
              >
                <Trash2 size={15} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{product.name}". This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Product Image */}
      <div className="mx-4 rounded-2xl overflow-hidden h-48 bg-muted mb-4 relative">
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
            <Package size={48} className="text-muted-foreground/30" />
          </div>
        )}
        {/* Discount badge on image */}
        {hasDiscount && (
          <div className="absolute top-3 right-3">
            <span className="bg-saffron text-ivory text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              {Number(product.discountPercent)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 space-y-4 pb-8">
        <div>
          <p className="text-xs font-body font-semibold text-saffron-dark uppercase tracking-wider mb-1">
            {product.category}
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {product.name}
          </h2>
        </div>

        {/* Price Details */}
        <div className="bg-muted/50 rounded-xl p-3 space-y-2">
          <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">
            Price Details
          </p>

          {/* Selling Price Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-maroon/10 rounded-xl px-3 py-2">
              <IndianRupee size={16} className="text-maroon" />
              <span className="font-display font-bold text-xl text-maroon">
                {Number(product.price).toLocaleString("en-IN")}
              </span>
            </div>
            {hasMrp && hasDiscount && (
              <span className="font-body text-sm text-muted-foreground line-through">
                ₹{Number(product.mrp).toLocaleString("en-IN")}
              </span>
            )}
            {hasDiscount && (
              <Badge className="bg-saffron text-ivory border-0 font-body font-bold text-xs px-2 py-0.5">
                {Number(product.discountPercent)}% OFF
              </Badge>
            )}
            <Badge
              variant={isLowStock ? "destructive" : "secondary"}
              className="text-sm px-3 py-1.5 rounded-xl"
            >
              {Number(product.stock)} units in stock
            </Badge>
          </div>

          {/* MRP row (when no discount) */}
          {hasMrp && !hasDiscount && (
            <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
              <span className="font-semibold">MRP:</span>
              <span>₹{Number(product.mrp).toLocaleString("en-IN")}</span>
            </div>
          )}

          {/* Wholesale Price */}
          {hasWholesale && (
            <div className="flex items-center gap-2 text-sm font-body">
              <span className="font-semibold text-muted-foreground">
                Wholesale:
              </span>
              <span className="text-foreground font-semibold">
                ₹{Number(product.wholesalePrice).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-muted-foreground">
                (bulk/trade price)
              </span>
            </div>
          )}

          {/* Unit */}
          {hasUnit && (
            <div className="flex items-center gap-2 text-sm font-body text-muted-foreground">
              <Ruler size={13} />
              <span>{product.unit}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="bg-muted/50 rounded-xl p-3">
            <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Description
            </p>
            <p className="text-sm font-body text-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Amenities & Features */}
        {(hasAmenities || hasTags || hasWarranty) && (
          <div className="bg-muted/50 rounded-xl p-3 space-y-3">
            <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">
              Amenities & Features
            </p>

            {/* Features */}
            {hasAmenities && (
              <div>
                <p className="text-xs font-body font-semibold text-foreground mb-1.5">
                  Features
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {product.amenities.map((feature) => (
                    <Badge
                      key={feature}
                      className="bg-saffron/15 text-saffron-dark border border-saffron/30 font-body text-xs font-medium px-2 py-0.5"
                      variant="outline"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {hasTags && (
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Tag size={12} className="text-muted-foreground" />
                  <p className="text-xs font-body font-semibold text-foreground">
                    Tags
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="font-body text-xs font-medium px-2 py-0.5"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty */}
            {hasWarranty && (
              <div className="flex items-start gap-2">
                <Shield
                  size={14}
                  className="text-maroon mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-xs font-body font-semibold text-foreground">
                    Warranty / Shelf Life
                  </p>
                  <p className="text-sm font-body text-muted-foreground">
                    {product.warranty}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleToggleTrending}
            disabled={setTrending.isPending}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 font-body font-semibold text-sm transition-all ${
              product.isTrending
                ? "bg-saffron text-ivory shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-saffron/20 hover:text-saffron-dark"
            } disabled:opacity-50`}
          >
            {product.isTrending ? (
              <TrendingDown size={16} />
            ) : (
              <TrendingUp size={16} />
            )}
            {product.isTrending ? "Remove Trending" : "Mark Trending"}
          </button>

          <button
            type="button"
            onClick={handleToggleShortlist}
            disabled={toggleShortlist.isPending}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 font-body font-semibold text-sm transition-all ${
              product.isShortlisted
                ? "bg-maroon text-ivory shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-maroon/20 hover:text-maroon"
            } disabled:opacity-50`}
          >
            {product.isShortlisted ? (
              <BookmarkCheck size={16} />
            ) : (
              <Bookmark size={16} />
            )}
            {product.isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </div>

        {/* Edit Button */}
        <Button
          className="w-full gradient-saffron text-ivory font-body font-semibold rounded-xl h-11 border-0"
          onClick={() =>
            navigate({
              to: "/products/$productId/edit",
              params: { productId: productId },
            })
          }
        >
          <Edit size={16} className="mr-2" />
          Edit Product
        </Button>
      </div>
    </div>
  );
}
