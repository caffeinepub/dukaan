import { useNavigate } from '@tanstack/react-router';
import { Package, BarChart3, AlertTriangle, Bookmark, Users, TrendingUp, IndianRupee } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardMetrics } from '../hooks/useQueries';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onClick?: () => void;
  subtitle?: string;
}

function MetricCard({ label, value, icon: Icon, color, bgColor, onClick, subtitle }: MetricCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} rounded-2xl p-4 flex flex-col gap-2 card-hover shadow-card text-left w-full border border-border/50`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-display font-bold text-foreground leading-none">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground font-body mt-0.5">{subtitle}</p>}
      </div>
      <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
    </button>
  );
}

function MetricSkeleton() {
  return (
    <div className="bg-card rounded-2xl p-4 flex flex-col gap-2 shadow-card border border-border/50">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: metrics, isLoading, error } = useDashboardMetrics();

  const formatCurrency = (val: bigint) => {
    const num = Number(val);
    if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
    return `₹${num}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/assets/generated/dukaan-hero-banner.dim_1200x400.png"
          alt="Dukaan Banner"
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon/70 to-transparent flex items-center px-5">
          <div>
            <h2 className="font-display text-xl font-bold text-ivory">Namaste! 🙏</h2>
            <p className="text-sm text-ivory/80 font-body">Welcome to your Dukaan</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-foreground">Business Overview</h2>
          <span className="text-xs text-muted-foreground font-body bg-muted px-2 py-1 rounded-full">Today</span>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4 text-sm text-destructive font-body">
            Failed to load metrics. Please try again.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <MetricSkeleton key={i} />)}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              label="Total Products"
              value={Number(metrics.totalProducts)}
              icon={Package}
              color="bg-saffron/20 text-saffron-dark"
              bgColor="bg-card"
              onClick={() => navigate({ to: '/products' })}
            />
            <MetricCard
              label="Stock Value"
              value={formatCurrency(metrics.totalStockValue)}
              icon={IndianRupee}
              color="bg-green-100 text-green-700"
              bgColor="bg-card"
              subtitle="Total inventory"
            />
            <MetricCard
              label="Low Stock Alerts"
              value={Number(metrics.lowStockItems)}
              icon={AlertTriangle}
              color={Number(metrics.lowStockItems) > 0 ? "bg-red-100 text-red-600" : "bg-muted text-muted-foreground"}
              bgColor={Number(metrics.lowStockItems) > 0 ? "bg-red-50 border-red-200" : "bg-card"}
              onClick={() => navigate({ to: '/stock' })}
              subtitle="Below threshold"
            />
            <MetricCard
              label="Shortlisted"
              value={Number(metrics.shortlistedProducts)}
              icon={Bookmark}
              color="bg-purple-100 text-purple-600"
              bgColor="bg-card"
              onClick={() => navigate({ to: '/shortlist' })}
            />
            <MetricCard
              label="Trending Items"
              value="—"
              icon={TrendingUp}
              color="bg-saffron/20 text-saffron-dark"
              bgColor="bg-card"
              onClick={() => navigate({ to: '/trending' })}
            />
            <MetricCard
              label="Shopkeepers"
              value={Number(metrics.connectedShopkeepers)}
              icon={Users}
              color="bg-blue-100 text-blue-600"
              bgColor="bg-card"
              onClick={() => navigate({ to: '/network' })}
              subtitle="In network"
            />
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="mt-6">
          <h3 className="font-display text-base font-bold text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Add Product', icon: Package, to: '/products/new', color: 'bg-saffron text-ivory' },
              { label: 'View Stock', icon: BarChart3, to: '/stock', color: 'bg-maroon text-ivory' },
              { label: 'Network', icon: Users, to: '/network', color: 'bg-maroon-light text-ivory' },
            ].map(({ label, icon: Icon, to, color }) => (
              <button
                key={to}
                onClick={() => navigate({ to })}
                className={`${color} rounded-xl p-3 flex flex-col items-center gap-1.5 card-hover shadow-xs`}
              >
                <Icon size={18} />
                <span className="text-xs font-body font-semibold text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
