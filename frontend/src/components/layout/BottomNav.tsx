import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  TrendingUp,
  Bookmark,
  Users,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/stock', label: 'Stock', icon: BarChart3 },
  { to: '/trending', label: 'Trending', icon: TrendingUp },
  { to: '/shortlist', label: 'Saved', icon: Bookmark },
  { to: '/network', label: 'Network', icon: Users },
];

export default function BottomNav() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 gradient-maroon border-t border-maroon-light/30 bottom-nav-safe shadow-lg">
      <div className="max-w-2xl mx-auto flex items-stretch">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = currentPath === to || (to !== '/dashboard' && currentPath.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-all duration-150 ${
                isActive
                  ? 'text-saffron'
                  : 'text-ivory/60 hover:text-ivory/90'
              }`}
            >
              <div className={`relative p-1 rounded-lg transition-all ${isActive ? 'bg-saffron/20' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                {isActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-saffron rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-body font-semibold tracking-wide ${isActive ? 'text-saffron' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
