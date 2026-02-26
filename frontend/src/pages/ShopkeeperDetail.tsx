import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Phone, MapPin, Tag, Store, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useShopkeeperById } from '../hooks/useQueries';

export default function ShopkeeperDetail() {
  const { shopkeeperId } = useParams({ from: '/network/$shopkeeperId' });
  const navigate = useNavigate();
  const id = BigInt(shopkeeperId);

  const { data: shopkeeper, isLoading, error } = useShopkeeperById(id);

  if (isLoading) {
    return (
      <div className="animate-fade-in px-4 pt-4 space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-4">
          <Skeleton className="w-20 h-20 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !shopkeeper) {
    return (
      <div className="px-4 pt-4">
        <button onClick={() => navigate({ to: '/network' })} className="flex items-center gap-2 text-muted-foreground mb-4">
          <ArrowLeft size={18} /> Back
        </button>
        <div className="text-center py-16">
          <p className="text-destructive font-body">Shopkeeper not found</p>
        </div>
      </div>
    );
  }

  const initials = shopkeeper.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="animate-fade-in">
      {/* Back */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => navigate({ to: '/network' })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-body text-sm font-medium">Network</span>
        </button>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-4">
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 gradient-maroon rounded-2xl flex items-center justify-center shadow-md flex-shrink-0">
              <span className="font-display font-bold text-ivory text-2xl">{initials}</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">{shopkeeper.shopName}</h2>
              <p className="text-sm text-muted-foreground font-body">{shopkeeper.name}</p>
              <span className="inline-flex items-center gap-1 mt-1 bg-saffron/20 text-saffron-dark text-xs font-body font-semibold px-2 py-0.5 rounded-full">
                <Tag size={10} />
                {shopkeeper.category}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Owner</p>
                <p className="text-sm font-body font-semibold text-foreground">{shopkeeper.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-green-600" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Location</p>
                <p className="text-sm font-body font-semibold text-foreground">{shopkeeper.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 bg-saffron/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-saffron-dark" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Phone</p>
                <a
                  href={`tel:${shopkeeper.phone}`}
                  className="text-sm font-body font-semibold text-maroon hover:underline"
                >
                  {shopkeeper.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-8 h-8 bg-maroon/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store size={14} className="text-maroon" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Shop Name</p>
                <p className="text-sm font-body font-semibold text-foreground">{shopkeeper.shopName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
