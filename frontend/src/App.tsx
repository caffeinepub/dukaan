import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductFormPage from './pages/ProductFormPage';
import StockManagement from './pages/StockManagement';
import TrendingProducts from './pages/TrendingProducts';
import Shortlist from './pages/Shortlist';
import ShopkeeperNetwork from './pages/ShopkeeperNetwork';
import ShopkeeperDetail from './pages/ShopkeeperDetail';
import ShopkeeperRegistration from './pages/ShopkeeperRegistration';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster richColors position="top-center" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => { throw redirect({ to: '/dashboard' }); },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductList,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId',
  component: ProductDetail,
});

const productAddRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/new',
  component: ProductFormPage,
});

const productEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products/$productId/edit',
  component: ProductFormPage,
});

const stockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stock',
  component: StockManagement,
});

const trendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trending',
  component: TrendingProducts,
});

const shortlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shortlist',
  component: Shortlist,
});

const networkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/network',
  component: ShopkeeperNetwork,
});

const shopkeeperDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/network/$shopkeeperId',
  component: ShopkeeperDetail,
});

const shopkeeperRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/network/register',
  component: ShopkeeperRegistration,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  productsRoute,
  productAddRoute,
  productDetailRoute,
  productEditRoute,
  stockRoute,
  trendingRoute,
  shortlistRoute,
  networkRoute,
  shopkeeperRegisterRoute,
  shopkeeperDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
