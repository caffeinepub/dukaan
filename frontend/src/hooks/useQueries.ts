import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Shopkeeper, DashboardMetrics } from '../backend';

// ─── Dashboard ───────────────────────────────────────────────────────────────

export function useDashboardMetrics() {
  const { actor, isFetching } = useActor();
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      return actor.getDashboardMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Products ────────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error('Actor not ready or no id');
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      category: string;
      description: string;
      price: bigint;
      mrp: bigint;
      wholesalePrice: bigint;
      discountPercent: bigint;
      unit: string;
      amenities: string[];
      tags: string[];
      warranty: string;
      stock: bigint;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.addProduct(
        data.name,
        data.category,
        data.description,
        data.price,
        data.mrp,
        data.wholesalePrice,
        data.discountPercent,
        data.unit,
        data.amenities,
        data.tags,
        data.warranty,
        data.stock,
        data.imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      category: string;
      description: string;
      price: bigint;
      mrp: bigint;
      wholesalePrice: bigint;
      discountPercent: bigint;
      unit: string;
      amenities: string[];
      tags: string[];
      warranty: string;
      stock: bigint;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateProduct(
        data.id,
        data.name,
        data.category,
        data.description,
        data.price,
        data.mrp,
        data.wholesalePrice,
        data.discountPercent,
        data.unit,
        data.amenities,
        data.tags,
        data.warranty,
        data.stock,
        data.imageUrl,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id.toString()] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
      queryClient.invalidateQueries({ queryKey: ['shortlistedProducts'] });
    },
  });
}

// ─── Stock ───────────────────────────────────────────────────────────────────

export function useLowStockProducts(threshold?: bigint) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['lowStockProducts', threshold?.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLowStockProducts(threshold ?? null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateStockQuantity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, newStock }: { productId: bigint; newStock: bigint }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.updateStockQuantity(productId, newStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['lowStockProducts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

// ─── Trending ────────────────────────────────────────────────────────────────

export function useTrendingProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['trendingProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTrendingProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetTrending() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, isTrending }: { productId: bigint; isTrending: boolean }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.setTrending(productId, isTrending);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['trendingProducts'] });
    },
  });
}

// ─── Shortlist ───────────────────────────────────────────────────────────────

export function useShortlistedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['shortlistedProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getShortlistedProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useToggleShortlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: bigint) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.toggleShortlist(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['shortlistedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}

// ─── Shopkeepers ─────────────────────────────────────────────────────────────

export function useAllShopkeepers() {
  const { actor, isFetching } = useActor();
  return useQuery<Shopkeeper[]>({
    queryKey: ['shopkeepers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllShopkeepers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useShopkeeperById(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Shopkeeper>({
    queryKey: ['shopkeeper', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error('Actor not ready or no id');
      return actor.getShopkeeperById(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useRegisterShopkeeper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      shopName: string;
      location: string;
      phone: string;
      category: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      return actor.registerShopkeeper(data.name, data.shopName, data.location, data.phone, data.category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shopkeepers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] });
    },
  });
}
