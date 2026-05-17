'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import DatePicker from '@/app/components/ui/DatePicker'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface Coupon {
  id: string; code: string; discountType: 'PERCENTAGE' | 'FIXED'
  discountValue: number; minOrderAmount: number; maxDiscount?: number
  expiresAt?: string; usageLimit?: number; usedCount: number; isActive: boolean
}

const EMPTY = {
  code: '', discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
  discountValue: 10, minOrderAmount: 0, maxDiscount: '',
  expiresAt: '', usageLimit: '', isActive: true,
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Coupon | null>(null)
  const [form, setForm] = useState({ ...EMPTY })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetchWithAuth(`${API}/api/v1/coupons`)
    const { data } = await res.json()
    setCoupons(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY })
    setError('')
    setShowForm(true)
  }

  function openEdit(c: Coupon) {
    setEditing(c)
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount / 100,
      maxDiscount: c.maxDiscount ? String(c.maxDiscount / 100) : '',
      expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '',
      usageLimit: c.usageLimit ? String(c.usageLimit) : '',
      isActive: c.isActive,
    })
    setError('')
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.code.trim()) return setError('Code is required')
    if (!form.discountValue) return setError('Discount value is required')
    setSaving(true)
    setError('')

    const body = JSON.stringify({
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: form.discountType === 'PERCENTAGE'
        ? Number(form.discountValue)
        : Math.round(Number(form.discountValue) * 100),
      minOrderAmount: Math.round(Number(form.minOrderAmount) * 100),
      maxDiscount: form.maxDiscount ? Math.round(Number(form.maxDiscount) * 100) : undefined,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      isActive: form.isActive,
    })

    const res = editing
      ? await fetchWithAuth(`${API}/api/v1/coupons/${editing.id}`, { method: 'PUT', body })
      : await fetchWithAuth(`${API}/api/v1/coupons`, { method: 'POST', body })
    const json = await res.json()
    setSaving(false)
    if (!res.ok) return setError(json.error?.message ?? 'Failed to save')
    setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Deactivate this coupon?')) return
    await fetchWithAuth(`${API}/api/v1/coupons/${id}`, { method: 'DELETE' })
    load()
  }

  function formatDiscount(c: Coupon) {
    if (c.discountType === 'PERCENTAGE') return `${c.discountValue}%`
    return `₹${(c.discountValue / 100).toLocaleString('en-IN')}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Coupons</h1>
        <button onClick={openAdd} className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-secondary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Coupon
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-surface rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-text-primary mb-5">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Code *</label>
              <input value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="SAVE20"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 font-mono" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Discount Type</label>
              <select value={form.discountType} onChange={(e) => set('discountType', e.target.value as 'PERCENTAGE' | 'FIXED')}
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30 bg-white">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">
                Discount Value {form.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'} *
              </label>
              <input type="number" min={1} value={form.discountValue}
                onChange={(e) => set('discountValue', Number(e.target.value))}
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Min Order Amount (₹)</label>
              <input type="number" min={0} value={form.minOrderAmount}
                onChange={(e) => set('minOrderAmount', Number(e.target.value))}
                placeholder="0"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            {form.discountType === 'PERCENTAGE' && (
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1 block">Max Discount Cap (₹)</label>
                <input type="number" min={0} value={form.maxDiscount}
                  onChange={(e) => set('maxDiscount', e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Expiry Date</label>
              <DatePicker
                value={form.expiresAt}
                onChange={(v) => set('expiresAt', v)}
                placeholder="No expiry"
                minDate={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-1 block">Usage Limit</label>
              <input type="number" min={1} value={form.usageLimit}
                onChange={(e) => set('usageLimit', e.target.value)}
                placeholder="Unlimited"
                className="w-full border border-surface rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary/30" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <label className="text-sm font-medium text-text-primary">Active</label>
              <button type="button" onClick={() => set('isActive', !form.isActive)}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-secondary' : 'bg-surface border border-surface'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isActive ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving}
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
        ) : coupons.length === 0 ? (
          <p className="text-center py-12 text-text-secondary text-sm">No coupons yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-surface bg-surface/50">
              <tr>
                {['Code', 'Discount', 'Min Order', 'Usage', 'Expires', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">{h}</th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-surface/30 transition-colors">
                  <td className="px-5 py-3 font-mono font-semibold text-text-primary">{c.code}</td>
                  <td className="px-5 py-3 text-text-secondary">{formatDiscount(c)}</td>
                  <td className="px-5 py-3 text-text-secondary">
                    {c.minOrderAmount > 0 ? `₹${(c.minOrderAmount / 100).toLocaleString('en-IN')}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {c.usedCount}{c.usageLimit ? `/${c.usageLimit}` : ''}
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-secondary/10 text-text-secondary hover:text-secondary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors">
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
