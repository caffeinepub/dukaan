import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Loader2, IndianRupee, Tag, Shield, Ruler } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useProductById, useAddProduct, useUpdateProduct } from '../hooks/useQueries';

interface FormData {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  category: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
};

export default function ProductFormPage() {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const productId = params.productId;
  const isEdit = !!productId && productId !== 'new';
  const id = isEdit ? BigInt(productId) : null;

  const { data: existingProduct } = useProductById(id);
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();

  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Pricing fields
  const [mrp, setMrp] = useState<string>('');
  const [wholesalePrice, setWholesalePrice] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<string>('');
  const [unit, setUnit] = useState<string>('');

  // Amenities fields
  const [amenities, setAmenities] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [warranty, setWarranty] = useState<string>('');

  useEffect(() => {
    if (existingProduct && isEdit) {
      setForm({
        name: existingProduct.name,
        category: existingProduct.category,
        description: existingProduct.description,
        price: existingProduct.price.toString(),
        stock: existingProduct.stock.toString(),
        imageUrl: existingProduct.imageUrl,
      });
      setMrp(Number(existingProduct.mrp) > 0 ? existingProduct.mrp.toString() : '');
      setWholesalePrice(Number(existingProduct.wholesalePrice) > 0 ? existingProduct.wholesalePrice.toString() : '');
      setDiscountPercent(Number(existingProduct.discountPercent) > 0 ? existingProduct.discountPercent.toString() : '');
      setUnit(existingProduct.unit || '');
      setAmenities(existingProduct.amenities.join(', '));
      setTags(existingProduct.tags.join(', '));
      setWarranty(existingProduct.warranty || '');
    }
  }, [existingProduct, isEdit]);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.category.trim()) newErrors.category = 'Category is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) newErrors.price = 'Valid price is required';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedMrp = BigInt(Math.round(Math.max(0, Number(mrp) || 0)));
    const parsedWholesale = BigInt(Math.round(Math.max(0, Number(wholesalePrice) || 0)));
    const parsedDiscount = BigInt(Math.min(100, Math.max(0, Math.round(Number(discountPercent) || 0))));
    const parsedAmenities = amenities.split(',').map((a) => a.trim()).filter(Boolean);
    const parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);

    try {
      if (isEdit && id) {
        await updateProduct.mutateAsync({
          id,
          name: form.name.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          price: BigInt(Math.round(Number(form.price))),
          mrp: parsedMrp,
          wholesalePrice: parsedWholesale,
          discountPercent: parsedDiscount,
          unit: unit.trim(),
          amenities: parsedAmenities,
          tags: parsedTags,
          warranty: warranty.trim(),
          stock: BigInt(Math.round(Number(form.stock))),
          imageUrl: form.imageUrl.trim(),
        });
        toast.success('Product updated successfully!');
      } else {
        await addProduct.mutateAsync({
          name: form.name.trim(),
          category: form.category.trim(),
          description: form.description.trim(),
          price: BigInt(Math.round(Number(form.price))),
          mrp: parsedMrp,
          wholesalePrice: parsedWholesale,
          discountPercent: parsedDiscount,
          unit: unit.trim(),
          amenities: parsedAmenities,
          tags: parsedTags,
          warranty: warranty.trim(),
          stock: BigInt(Math.round(Number(form.stock))),
          imageUrl: form.imageUrl.trim(),
        });
        toast.success('Product added successfully!');
      }
      navigate({ to: '/products' });
    } catch (err) {
      toast.error('Failed to save product. Make sure you are registered as a shopkeeper first.');
    }
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => navigate({ to: '/products' })}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className="font-display text-xl font-bold text-foreground">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="px-4 space-y-4 pb-8">
        {/* Name */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">Product Name *</Label>
          <Input
            value={form.name}
            onChange={handleChange('name')}
            placeholder="e.g. Basmati Rice 5kg"
            className="rounded-xl font-body"
          />
          {errors.name && <p className="text-xs text-destructive font-body">{errors.name}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">Category *</Label>
          <Input
            value={form.category}
            onChange={handleChange('category')}
            placeholder="e.g. Groceries, Electronics, Clothing"
            className="rounded-xl font-body"
          />
          {errors.category && <p className="text-xs text-destructive font-body">{errors.category}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">Description</Label>
          <Textarea
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Describe your product..."
            className="rounded-xl font-body resize-none"
            rows={3}
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm">Selling Price (₹) *</Label>
            <Input
              type="number"
              value={form.price}
              onChange={handleChange('price')}
              placeholder="0"
              min="0"
              className="rounded-xl font-body"
            />
            {errors.price && <p className="text-xs text-destructive font-body">{errors.price}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="font-body font-semibold text-sm">Stock Qty *</Label>
            <Input
              type="number"
              value={form.stock}
              onChange={handleChange('stock')}
              placeholder="0"
              min="0"
              className="rounded-xl font-body"
            />
            {errors.stock && <p className="text-xs text-destructive font-body">{errors.stock}</p>}
          </div>
        </div>

        {/* Image URL */}
        <div className="space-y-1.5">
          <Label className="font-body font-semibold text-sm">Image URL</Label>
          <Input
            value={form.imageUrl}
            onChange={handleChange('imageUrl')}
            placeholder="https://example.com/image.jpg"
            className="rounded-xl font-body"
          />
          {form.imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden h-24 bg-muted">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        {/* ── Pricing Details Section ── */}
        <div className="pt-2">
          <Separator className="mb-4" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 gradient-saffron rounded-lg flex items-center justify-center">
              <IndianRupee size={14} className="text-ivory" />
            </div>
            <h3 className="font-display font-bold text-base text-foreground">Pricing Details</h3>
            <span className="text-xs text-muted-foreground font-body">(optional)</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm">MRP (₹)</Label>
              <Input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="Maximum Retail Price"
                min="0"
                className="rounded-xl font-body"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm">Wholesale Price (₹)</Label>
              <Input
                type="number"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                placeholder="Wholesale / Bulk Price"
                min="0"
                className="rounded-xl font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm">Discount (%)</Label>
              <Input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="e.g. 10"
                min="0"
                max="100"
                className="rounded-xl font-body"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm flex items-center gap-1">
                <Ruler size={12} />
                Unit of Measure
              </Label>
              <Input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. per kg, per piece"
                className="rounded-xl font-body"
              />
            </div>
          </div>
        </div>

        {/* ── Product Amenities Section ── */}
        <div className="pt-2">
          <Separator className="mb-4" />
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 gradient-maroon rounded-lg flex items-center justify-center">
              <Tag size={14} className="text-ivory" />
            </div>
            <h3 className="font-display font-bold text-base text-foreground">Product Amenities</h3>
            <span className="text-xs text-muted-foreground font-body">(optional)</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm">Features / Highlights</Label>
              <Input
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="e.g. Organic, Handmade, Cold-pressed (comma-separated)"
                className="rounded-xl font-body"
              />
              <p className="text-[11px] text-muted-foreground font-body">Separate multiple features with commas</p>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm">Tags</Label>
              <Input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. popular, bestseller, new-arrival (comma-separated)"
                className="rounded-xl font-body"
              />
              <p className="text-[11px] text-muted-foreground font-body">Separate multiple tags with commas</p>
            </div>

            <div className="space-y-1.5">
              <Label className="font-body font-semibold text-sm flex items-center gap-1">
                <Shield size={12} />
                Warranty / Shelf Life
              </Label>
              <Input
                type="text"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
                placeholder="e.g. 6 months warranty, Best before 3 months"
                className="rounded-xl font-body"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full gradient-saffron text-ivory font-body font-bold rounded-xl h-12 border-0 text-base mt-2"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              {isEdit ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            isEdit ? 'Update Product' : 'Add Product'
          )}
        </Button>
      </form>
    </div>
  );
}
