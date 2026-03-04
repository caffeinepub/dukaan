import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Plus, Search, Store, Tag, Users } from "lucide-react";
import { useMemo, useState } from "react";
import type { Shopkeeper } from "../backend";
import { useAllShopkeepers } from "../hooks/useQueries";

interface ShopkeeperCardProps {
  shopkeeper: Shopkeeper;
  onClick: () => void;
}

function ShopkeeperCard({ shopkeeper, onClick }: ShopkeeperCardProps) {
  const initials = shopkeeper.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-card rounded-2xl shadow-card border border-border/50 p-4 flex items-center gap-3 card-hover w-full text-left"
    >
      {/* Avatar */}
      <div className="w-12 h-12 gradient-maroon rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
        <span className="font-display font-bold text-ivory text-sm">
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-bold text-sm text-foreground truncate">
          {shopkeeper.shopName}
        </h3>
        <p className="text-xs text-muted-foreground font-body truncate">
          {shopkeeper.name}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground font-body">
            <MapPin size={9} />
            {shopkeeper.location}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] text-saffron-dark font-body font-semibold">
            <Tag size={9} />
            {shopkeeper.category}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
        <span className="text-muted-foreground text-xs">›</span>
      </div>
    </button>
  );
}

export default function ShopkeeperNetwork() {
  const navigate = useNavigate();
  const { data: shopkeepers = [], isLoading } = useAllShopkeepers();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const cities = useMemo(() => {
    return Array.from(new Set(shopkeepers.map((s) => s.location)))
      .filter(Boolean)
      .sort();
  }, [shopkeepers]);

  const categories = useMemo(() => {
    return Array.from(new Set(shopkeepers.map((s) => s.category)))
      .filter(Boolean)
      .sort();
  }, [shopkeepers]);

  const filtered = useMemo(() => {
    return shopkeepers.filter((s) => {
      const matchSearch =
        s.shopName.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      const matchCity = cityFilter === "all" || s.location === cityFilter;
      const matchCat =
        categoryFilter === "all" || s.category === categoryFilter;
      return matchSearch && matchCity && matchCat;
    });
  }, [shopkeepers, search, cityFilter, categoryFilter]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-maroon rounded-xl flex items-center justify-center shadow-sm">
              <Users size={20} className="text-ivory" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Shopkeeper Network
              </h2>
              <p className="text-xs text-muted-foreground font-body">
                {shopkeepers.length} registered shops
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/network/register" })}
            className="gradient-saffron text-ivory w-9 h-9 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Search shops or owners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border rounded-xl font-body text-sm"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="bg-card border-border rounded-xl font-body text-sm h-9">
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-card border-border rounded-xl font-body text-sm h-9">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="px-4 pb-4 space-y-2">
        {isLoading ? (
          ["a", "b", "c", "d", "e"].map((k) => (
            <Skeleton
              key={`skeleton-shopkeeper-${k}`}
              className="h-20 w-full rounded-2xl"
            />
          ))
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Store size={28} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-bold text-foreground mb-1">
              {shopkeepers.length === 0
                ? "No Shopkeepers Yet"
                : "No Results Found"}
            </h3>
            <p className="text-sm text-muted-foreground font-body mb-4">
              {shopkeepers.length === 0
                ? "Be the first to register your shop!"
                : "Try adjusting your search or filters"}
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/network/register" })}
              className="gradient-maroon text-ivory font-body font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm"
            >
              Register My Shop
            </button>
          </div>
        ) : (
          filtered.map((shopkeeper) => (
            <ShopkeeperCard
              key={shopkeeper.id.toString()}
              shopkeeper={shopkeeper}
              onClick={() =>
                navigate({
                  to: "/network/$shopkeeperId",
                  params: { shopkeeperId: shopkeeper.id.toString() },
                })
              }
            />
          ))
        )}
      </div>

      {/* Register FAB */}
      {shopkeepers.length > 0 && (
        <button
          type="button"
          onClick={() => navigate({ to: "/network/register" })}
          className="fixed bottom-24 right-4 gradient-maroon text-ivory font-body font-semibold text-sm px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 z-30 hover:scale-105 transition-transform"
        >
          <Plus size={16} />
          Register My Shop
        </button>
      )}
    </div>
  );
}
