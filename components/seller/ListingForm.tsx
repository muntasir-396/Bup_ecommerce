'use client'

import React, { useState } from 'react'
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Eye,
  CheckCircle2,
  DollarSign
} from 'lucide-react'
import { ProductCard } from '@/components/marketplace/ProductCard'
import { ExtendedProduct } from '@/data/products'
import { useBup } from '@/context/BupContext'

interface ListingFormProps {
  initialListing?: any
  onSubmit: (listingData: any) => void
  onCancel?: () => void
}

const SAMPLE_IMAGE_OPTIONS = [
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
]

export function ListingForm({ initialListing, onSubmit, onCancel }: ListingFormProps) {
  const { currentUser } = useBup()

  const [title, setTitle] = useState(initialListing?.title || '')
  const [category, setCategory] = useState(initialListing?.category || 'Merch')
  const [condition, setCondition] = useState<'NEW' | 'USED_LIKE_NEW' | 'USED_GOOD'>(
    initialListing?.condition || 'NEW'
  )
  const [price, setPrice] = useState<number>(initialListing?.price || 450)
  const [originalPrice, setOriginalPrice] = useState<number>(initialListing?.originalPrice || 550)
  const [stock, setStock] = useState<number>(initialListing?.stock || 5)
  const [description, setDescription] = useState(initialListing?.description || '')
  const [deliveryTime, setDeliveryTime] = useState(initialListing?.deliveryTime || 'Same Day on Campus')
  const [pickupOption, setPickupOption] = useState(
    initialListing?.pickupOption || 'Central Library or FST Lobby Handover'
  )
  const [images, setImages] = useState<string[]>(
    initialListing?.images?.length > 0 ? initialListing.images : [SAMPLE_IMAGE_OPTIONS[0]]
  )

  // Auto calculate discount percentage
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0

  const handleAddSampleImage = (img: string) => {
    if (images.length < 6 && !images.includes(img)) {
      setImages([...images, img])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent, isDraft = false) => {
    e.preventDefault()
    onSubmit({
      title,
      category,
      condition,
      price,
      originalPrice,
      stock,
      description,
      deliveryTime,
      pickupOption,
      images,
      isDraft,
    })
  }

  // Construct preview product for live Flipkart-style card
  const previewProduct: ExtendedProduct = {
    id: 'preview',
    name: title || 'Your Product Title Will Appear Here',
    category,
    price: Number(price) || 0,
    originalPrice: Number(originalPrice) || undefined,
    discountPercent,
    rating: 5.0,
    reviewsCount: 1,
    seller: currentUser?.name || 'Your Campus Store',
    sellerType: 'Student Vendor',
    isVerifiedSeller: currentUser?.isBupVerified ?? true,
    image: images[0] || SAMPLE_IMAGE_OPTIONS[0],
    description: description || 'Add description...',
    inStock: stock > 0,
    tag: condition === 'NEW' ? 'Brand New' : 'Verified Pre-owned',
    deliveryTime,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
      
      {/* FORM ON THE LEFT */}
      <form onSubmit={(e) => handleSubmit(e, false)} className="rounded-xl bg-white p-6 border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-base text-neutral-900">
            {initialListing ? 'Edit Campus Listing' : 'Create New Campus Listing'}
          </h3>
          <span className="text-xs text-neutral-400">All fields required for student safety</span>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Listing Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Official BUP Winter Varsity Hoodie (Size L) or Thomas Calculus 11th Ed"
            className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
          />
        </div>

        {/* Category & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
            >
              <option value="Merch">Varsity Merch</option>
              <option value="Books & Notes">Books & Notes</option>
              <option value="Dining & Canteen">Dining & Canteen</option>
              <option value="Coffee & Snacks">Coffee & Snacks</option>
              <option value="Electronics">Electronics & Hardware</option>
              <option value="Stationery">Stationery & Art</option>
              <option value="Services">Campus Services</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
            >
              <option value="NEW">Brand New (Unopened / Tagged)</option>
              <option value="USED_LIKE_NEW">Used - Like New (Pristine)</option>
              <option value="USED_GOOD">Used - Good (Clean & Usable)</option>
            </select>
          </div>
        </div>

        {/* Pricing: Price, MRP, % off */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Selling Price (৳) *
            </label>
            <input
              type="number"
              required
              min="10"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Original MRP (৳)
            </label>
            <input
              type="number"
              min="10"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Number(e.target.value))}
              placeholder="e.g. 600"
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Calculated Discount
            </label>
            <div className="flex items-center h-[38px] rounded-lg bg-emerald-50 px-3 text-xs font-black text-emerald-700 border border-emerald-200">
              {discountPercent > 0 ? `${discountPercent}% Off` : '0% Off'}
            </div>
          </div>
        </div>

        {/* Stock & Pickup Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Available Units (Stock) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="500"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Handover Pickup Point on Campus *
            </label>
            <input
              type="text"
              required
              value={pickupOption}
              onChange={(e) => setPickupOption(e.target.value)}
              placeholder="e.g. Central Library Lawn or FST Lobby"
              className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
            />
          </div>
        </div>

        {/* Images Selection (up to 6) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-neutral-700">
              Product Images ({images.length}/6)
            </label>
            <span className="text-[10px] text-neutral-400">Click to add campus sample photos</span>
          </div>

          {/* Current selected image thumbnails */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group size-16 rounded-lg overflow-hidden border border-neutral-200 shadow-2xs">
                <img src={img} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Quick sample image picker palette */}
          <div className="rounded-lg bg-[#FAF5E9] p-2.5 border border-[#213527]/10">
            <p className="text-[11px] font-bold text-neutral-600 mb-1.5">Add Sample Images:</p>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {SAMPLE_IMAGE_OPTIONS.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSampleImage(img)}
                  className="size-12 rounded overflow-hidden border border-neutral-300 shrink-0 hover:scale-105 transition-transform"
                >
                  <img src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-neutral-700 mb-1">
            Detailed Description *
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the condition, size, edition, or preparation details of this item..."
            className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1f3a2e]"
          />
        </div>

        {/* Buttons: Save Draft, Publish, Cancel */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
            >
              Cancel
            </button>
          )}

          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50"
          >
            Save as Draft
          </button>

          <button
            type="submit"
            className="rounded-lg bg-[#1f3a2e] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#b5573a] transition-colors shadow-2xs"
          >
            {initialListing ? 'Save Changes' : 'Publish Listing'}
          </button>
        </div>
      </form>

      {/* LIVE PREVIEW CARD ON THE RIGHT */}
      <aside className="sticky top-24 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
          <Eye className="size-4 text-[#b5573a]" />
          <span>Live Marketplace Preview</span>
        </div>
        <p className="text-xs text-neutral-500">
          This is exactly how campus buyers will see your card in the catalog.
        </p>

        <div className="max-w-xs mx-auto">
          <ProductCard product={previewProduct} />
        </div>

        <div className="rounded-xl bg-white p-3 border border-neutral-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-neutral-500">Handover Spot:</span>
            <span className="font-bold text-neutral-900 truncate max-w-[170px]">{pickupOption}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Campus Commission:</span>
            <span className="font-bold text-emerald-700">5% standard (95% to you)</span>
          </div>
        </div>
      </aside>

    </div>
  )
}
