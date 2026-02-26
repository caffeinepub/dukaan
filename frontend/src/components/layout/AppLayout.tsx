import { type ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 gradient-maroon shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <img
            src="/assets/generated/dukaan-logo.dim_256x256.png"
            alt="Dukaan Logo"
            className="w-10 h-10 rounded-lg object-cover shadow-sm"
          />
          <div>
            <h1 className="font-display text-2xl font-bold text-ivory leading-none tracking-wide">
              दुकान
            </h1>
            <p className="text-xs text-saffron-light font-body font-medium tracking-widest uppercase">
              Dukaan
            </p>
          </div>
          <div className="ml-auto">
            <span className="text-xs text-ivory/60 font-body">Shop Smart</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
