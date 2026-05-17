'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, Check, ImageIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface Category { id: string; name: string }
interface Product {
  id: string; name: string; slug: string; weight: string
  price: number; mrp: number; discountPercent: number
  imageSrc: string; images: string[]; badge?: string
  description?: string; highlights: string[]; detailParagraphs: string[]
  isActive: boolean; categoryId?: string
  category?: { id: string; name: string }
}

const EMPTY: Omit<Product, 'id' | 'price'> = {
  name: '', slug: '', weight: '', mrp: 0, discountPercent: 0,
  imageSrc: '', images: [], badge: '', description: '',
  highlights: [], detailParagraphs: [], isActive: true, categoryId: undefined,
}

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function uploadImage(file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetchWithAuth(`${API}/api/v1/upload`, { method: 'POST', body: form })
  if (!res.ok) throw new Error('Upload failed')
  const { data } = await res.json()
  return data.url
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const multiRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const [pr, cr] = await Promise.all([
      fetchWithAuth(`${API}/api/v1/products`).then((r) => r.json()),
      fetchWithAuth(`${API}/api/v1/categories`).then((r) => r.json()),
    ])
    setProducts(pr.data ?? [])
    setCategories(cr.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const computedPrice = Math.round(form.mrp * (1 - form.discountPercent / 100))

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY })
    setError('')
    setShowForm(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name, slug: p.slug, weight: p.weight,
      mrp: p.mrp / 100, discountPercent: p.discountPercent,
      imageSrc: p.imageSrc, images: p.images, badge: p.badge ?? '',
      description: p.description ?? '', highlights: p.highlights,
      detailParagraphs: p.detailParagraphs, isActive: p.isActive,
      categoryId: p.categoryId,
    })
    setError('')
    setShowForm(true)
  }

  async function handlePrimaryImage(file: File) {
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, imageSrc: url, images: [url, ...f.images.filter((u) => u !== f.imageSrc)] }))
    } catch { setError('Image upload failed') }
    setUploading(false)
  }

  async function handleExtraImages(files: FileList) {
    setUploading(true)
    try {
      const urls = await Promise.all(Array.from(files).map(uploadImage))
      setForm((f) => ({ ...f, images: [...f.images, ...urls] }))
    } catch { setError('Image upload failed') }
    setUploading(false)
  }

  async function handleSave() {
    if (!form.name.trim()) return setError('Name is required')
    if (!form.imageSrc) return setError('Primary image is required')
    if (form.mrp <= 0) return setError('MRP must be greater than 0')
    setSaving(true)
    setError('')

    const body = JSON.stringify({
      name: form.name.trim(),
      slug: form.slug || slugify(form.name),
      weight: form.weight.trim(),
      mrp: Math.round(form.mrp * 100),
      discountPercent: form.discountPercent,
      imageSrc: form.imageSrc,
      images: form.images.length ? form.images : [form.imageSrc],
      badge: form.badge || undefined,
      description: form.description || undefined,
      highlights: form.highlights.filter(Boolean),
      detailParagraphs: form.detailParagraphs.filter(Boolean),
      isActive: form.isActive,
      categoryId: form.categoryId || undefined,
    })

    const res = editing
      ? await fetchWithAuth(`${API}/api/v1/products/${editing.id}`, { method: 'PUT', body })
      : await fetchWithAuth(`${API}/api/v1/products`, { method: 'POST', body })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) return setError(json.error?.message ?? 'Failed to save')
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deactivate this product?')) return
    await fetchWithAuth(`${API}/api/v1/products/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Products</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-surface rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-text-primary mb-5">{editing ? 'Edit Product' : 'New Product'}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Name *</label>
              <input value={form.name} onChange={(e) => { set('name', e.target.value); if (!editing) set('slug', slugify(e.target.value)) }}
                placeholder="A2 Bilona Cow Ghee"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            {/* Slug */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Slug</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)}
                placeholder="a2-bilona-cow-ghee"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            {/* Weight */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Weight</label>
              <input value={form.weight} onChange={(e) => set('weight', e.target.value)}
                placeholder="500 ml"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Category</label>
              <select value={form.categoryId ?? ''} onChange={(e) => set('categoryId', e.target.value || undefined)}
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 bg-white">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {/* MRP */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">MRP (₹) *</label>
              <input type="number" min={0} value={form.mrp || ''} onChange={(e) => set('mrp', Number(e.target.value))}
                placeholder="699"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            {/* Discount */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">
                Discount — {form.discountPercent}% &nbsp;
                <span className="text-secondary font-bold">→ ₹{computedPrice.toLocaleString('en-IN')}</span>
              </label>
              <input type="range" min={0} max={100} value={form.discountPercent}
                onChange={(e) => set('discountPercent', Number(e.target.value))}
                className="w-full accent-secondary" />
            </div>
            {/* Badge */}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Badge</label>
              <input value={form.badge} onChange={(e) => set('badge', e.target.value)}
                placeholder="Best Seller"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            {/* Active */}
            <div className="flex items-center gap-3 pt-5">
              <label className="text-sm font-medium text-text-primary">Active</label>
              <button type="button" onClick={() => set('isActive', !form.isActive)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-secondary' : 'bg-surface border border-surface'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-text-secondary mb-1 block">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={2} placeholder="Short product description…"
              className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 resize-none" />
          </div>

          {/* Images */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-text-secondary mb-2 block">Primary Image *</label>
            <div className="flex items-center gap-3">
              {form.imageSrc ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-surface shrink-0">
                  <Image src={form.imageSrc} alt="primary" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-surface flex items-center justify-center shrink-0">
                  <ImageIcon className="w-6 h-6 text-text-secondary/40" />
                </div>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="border border-surface rounded-xl px-4 py-2 text-sm text-text-secondary hover:bg-surface disabled:opacity-50">
                {uploading ? 'Uploading…' : 'Upload image'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && handlePrimaryImage(e.target.files[0])} />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-text-secondary mb-2 block">Additional Images</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-surface group">
                  <Image src={url} alt="" fill className="object-cover" />
                  <button onClick={() => set('images', form.images.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => multiRef.current?.click()} disabled={uploading}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-surface flex items-center justify-center hover:border-secondary/40 transition-colors disabled:opacity-50">
                <Plus className="w-5 h-5 text-text-secondary/40" />
              </button>
              <input ref={multiRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => e.target.files && handleExtraImages(e.target.files)} />
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-text-secondary mb-2 block">Highlights</label>
            {form.highlights.map((h, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={h} onChange={(e) => { const a = [...form.highlights]; a[i] = e.target.value; set('highlights', a) }}
                  placeholder={`Highlight ${i + 1}`}
                  className="flex-1 border border-surface rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
                <button onClick={() => set('highlights', form.highlights.filter((_, idx) => idx !== i))}
                  className="p-2 text-text-secondary hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => set('highlights', [...form.highlights, ''])}
              className="text-xs text-secondary hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add highlight
            </button>
          </div>

          {/* Detail paragraphs */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-text-secondary mb-2 block">Detail Paragraphs</label>
            {form.detailParagraphs.map((p, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <textarea value={p} rows={2} onChange={(e) => { const a = [...form.detailParagraphs]; a[i] = e.target.value; set('detailParagraphs', a) }}
                  placeholder={`Paragraph ${i + 1}`}
                  className="flex-1 border border-surface rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-secondary/30 resize-none" />
                <button onClick={() => set('detailParagraphs', form.detailParagraphs.filter((_, idx) => idx !== i))}
                  className="p-2 text-text-secondary hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => set('detailParagraphs', [...form.detailParagraphs, ''])}
              className="text-xs text-secondary hover:underline flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add paragraph
            </button>
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving || uploading}
              className="flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50">
              <Check className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="flex items-center gap-1.5 border border-surface px-4 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-text-secondary text-sm">Loading…</p>
        ) : products.length === 0 ? (
          <p className="text-center py-12 text-text-secondary text-sm">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-surface bg-surface/50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">MRP</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Discount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-surface shrink-0">
                        {p.imageSrc && <Image src={p.imageSrc} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{p.name}</p>
                        <p className="text-text-secondary text-xs">{p.weight}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-text-secondary">{p.category?.name ?? '—'}</td>
                  <td className="px-5 py-3 text-text-secondary">₹{(p.mrp / 100).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    {p.discountPercent > 0 ? (
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{p.discountPercent}% off</span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 font-semibold text-secondary">₹{(p.price / 100).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-secondary/10 text-text-secondary hover:text-secondary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
