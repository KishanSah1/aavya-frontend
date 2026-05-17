'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface Category {
  id: string
  name: string
  slug: string
  isActive: boolean
  _count?: { products: number }
}

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetchWithAuth(`${API}/api/v1/categories`)
    const { data } = await res.json()
    setCategories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setEditing(null)
    setName('')
    setSlug('')
    setError('')
    setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditing(cat)
    setName(cat.name)
    setSlug(cat.slug)
    setError('')
    setShowForm(true)
  }

  async function handleSave() {
    if (!name.trim()) return setError('Name is required')
    setSaving(true)
    setError('')
    const body = JSON.stringify({ name: name.trim(), slug: slug || slugify(name) })
    const res = editing
      ? await fetchWithAuth(`${API}/api/v1/categories/${editing.id}`, { method: 'PUT', body })
      : await fetchWithAuth(`${API}/api/v1/categories`, { method: 'POST', body })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) return setError(json.error?.message ?? 'Failed to save')
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deactivate this category?')) return
    await fetchWithAuth(`${API}/api/v1/categories/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Categories</h1>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-surface rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-text-primary mb-4">{editing ? 'Edit Category' : 'New Category'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); if (!editing) setSlug(slugify(e.target.value)) }}
                placeholder="e.g. Ghee"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Slug</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. ghee"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50">
              <Check className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setShowForm(false)} className="flex items-center gap-1.5 border border-surface px-4 py-2 rounded-xl text-sm text-text-secondary hover:bg-surface">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-surface shadow-sm overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-text-secondary text-sm">Loading…</p>
        ) : categories.length === 0 ? (
          <p className="text-center py-12 text-text-secondary text-sm">No categories yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-surface bg-surface/50">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Slug</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">Products</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-5 py-3 font-medium text-text-primary">{cat.name}</td>
                  <td className="px-5 py-3 text-text-secondary">{cat.slug}</td>
                  <td className="px-5 py-3 text-text-secondary">{cat._count?.products ?? 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-secondary/10 text-text-secondary hover:text-secondary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
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
