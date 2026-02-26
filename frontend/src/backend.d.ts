import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Shopkeeper {
    id: bigint;
    principal: Principal;
    name: string;
    shopName: string;
    category: string;
    phone: string;
    location: string;
}
export interface DashboardMetrics {
    totalProducts: bigint;
    totalStockValue: bigint;
    connectedShopkeepers: bigint;
    shortlistedProducts: bigint;
    lowStockItems: bigint;
}
export interface Product {
    id: bigint;
    mrp: bigint;
    name: string;
    wholesalePrice: bigint;
    tags: Array<string>;
    unit: string;
    description: string;
    discountPercent: bigint;
    amenities: Array<string>;
    stock: bigint;
    imageUrl: string;
    category: string;
    isShortlisted: boolean;
    price: bigint;
    warranty: string;
    isTrending: boolean;
    shopkeeperId: bigint;
}
export interface backendInterface {
    addProduct(name: string, category: string, description: string, price: bigint, mrp: bigint, wholesalePrice: bigint, discountPercent: bigint, unit: string, amenities: Array<string>, tags: Array<string>, warranty: string, stock: bigint, imageUrl: string): Promise<bigint>;
    deleteProduct(id: bigint): Promise<void>;
    getAllShopkeepers(): Promise<Array<Shopkeeper>>;
    getDashboardMetrics(): Promise<DashboardMetrics>;
    getLowStockProducts(threshold: bigint | null): Promise<Array<Product>>;
    getProductById(id: bigint): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getShopkeeperById(id: bigint): Promise<Shopkeeper>;
    getShortlistedProducts(): Promise<Array<Product>>;
    getTrendingProducts(): Promise<Array<Product>>;
    registerShopkeeper(name: string, shopName: string, location: string, phone: string, category: string): Promise<bigint>;
    setTrending(productId: bigint, isTrending: boolean): Promise<void>;
    toggleShortlist(productId: bigint): Promise<void>;
    updateProduct(id: bigint, name: string, category: string, description: string, price: bigint, mrp: bigint, wholesalePrice: bigint, discountPercent: bigint, unit: string, amenities: Array<string>, tags: Array<string>, warranty: string, stock: bigint, imageUrl: string): Promise<void>;
    updateStockQuantity(productId: bigint, newStock: bigint): Promise<void>;
}
