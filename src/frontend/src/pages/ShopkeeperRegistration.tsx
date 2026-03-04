import CitySearchInput from "@/components/common/CitySearchInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Store } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterShopkeeper } from "../hooks/useQueries";

const SHOP_CATEGORIES = [
  "Groceries & Kirana",
  "Fruits & Vegetables",
  "Dairy & Bakery",
  "Meat, Fish & Eggs",
  "Electronics & Mobiles",
  "Clothing & Textiles",
  "Footwear",
  "Hardware & Tools",
  "Furniture & Home Decor",
  "Pharmacy & Medical",
  "Stationary & Books",
  "Toys & Games",
  "Sports & Fitness",
  "Automobiles & Spare Parts",
  "Jewellery & Accessories",
  "Cosmetics & Beauty",
  "Agricultural Supplies",
  "Electrical & Lighting",
  "Plumbing & Sanitary",
  "Paints & Construction",
  "Computer & IT Products",
  "Sweets & Namkeen",
  "Wholesale & Distribution",
  "Other",
];

interface FormData {
  name: string;
  shopName: string;
  location: string;
  phone: string;
  category: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  shopName: "",
  location: "",
  phone: "",
  category: "",
};

export default function ShopkeeperRegistration() {
  const navigate = useNavigate();
  const registerShopkeeper = useRegisterShopkeeper();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Owner name is required";
    if (!form.shopName.trim()) newErrors.shopName = "Shop name is required";
    if (!form.location.trim()) newErrors.location = "Location/City is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    }
    if (!form.category.trim()) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerShopkeeper.mutateAsync({
        name: form.name.trim(),
        shopName: form.shopName.trim(),
        location: form.location.trim(),
        phone: form.phone.trim(),
        category: form.category.trim(),
      });
      toast.success("Shop registered successfully! Welcome to the network 🎉");
      navigate({ to: "/network" });
    } catch {
      toast.error("Failed to register shop. Please try again.");
    }
  };

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleLocationChange = (value: string) => {
    setForm((prev) => ({ ...prev, location: value }));
    if (errors.location)
      setErrors((prev) => ({ ...prev, location: undefined }));
  };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value }));
    if (errors.category)
      setErrors((prev) => ({ ...prev, category: undefined }));
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/network" })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Register My Shop
          </h2>
          <p className="text-xs text-muted-foreground font-body">
            Join the Dukaan network
          </p>
        </div>
      </div>

      {/* Banner */}
      <div className="mx-4 mb-4 gradient-maroon rounded-2xl p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-ivory/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Store size={20} className="text-ivory" />
        </div>
        <div>
          <p className="font-display font-bold text-ivory text-sm">
            Connect with 1000s of Shopkeepers
          </p>
          <p className="text-xs text-ivory/80 font-body">
            Register your shop and grow your network
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-4 pb-6">
        {/* Owner Name */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">
            Owner Name *
          </Label>
          <Input
            value={form.name}
            onChange={handleChange("name")}
            placeholder="e.g. Ramesh Kumar"
            className="rounded-xl font-body"
          />
          {errors.name && (
            <p className="text-xs text-destructive font-body">{errors.name}</p>
          )}
        </div>

        {/* Shop Name */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">Shop Name *</Label>
          <Input
            value={form.shopName}
            onChange={handleChange("shopName")}
            placeholder="e.g. Ramesh General Store"
            className="rounded-xl font-body"
          />
          {errors.shopName && (
            <p className="text-xs text-destructive font-body">
              {errors.shopName}
            </p>
          )}
        </div>

        {/* Location - City Dropdown */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">
            City / Location *
          </Label>
          <CitySearchInput
            value={form.location}
            onChange={handleLocationChange}
            placeholder="Search and select your city..."
            data-ocid="registration.location.select"
          />
          {errors.location && (
            <p className="text-xs text-destructive font-body">
              {errors.location}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">
            Mobile Number *
          </Label>
          <Input
            type="tel"
            value={form.phone}
            onChange={handleChange("phone")}
            placeholder="e.g. 9876543210"
            maxLength={10}
            className="rounded-xl font-body"
          />
          {errors.phone && (
            <p className="text-xs text-destructive font-body">{errors.phone}</p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">
            Business Category *
          </Label>
          <Select value={form.category} onValueChange={handleCategoryChange}>
            <SelectTrigger
              className="rounded-xl font-body"
              data-ocid="registration.category.select"
            >
              <SelectValue placeholder="Select your business category" />
            </SelectTrigger>
            <SelectContent>
              {SHOP_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="font-body">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-xs text-destructive font-body">
              {errors.category}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={registerShopkeeper.isPending}
          className="w-full gradient-maroon text-ivory font-body font-bold rounded-xl h-12 border-0 text-base mt-2"
        >
          {registerShopkeeper.isPending ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Registering...
            </>
          ) : (
            "Register My Shop 🏪"
          )}
        </Button>
      </form>
    </div>
  );
}
