'use client'

import { useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface ReferralConfig {
  firstReferralCoins: number
  secondReferralCoins: number
  subsequentReferralCoins: number
}

interface ReferralRow {
  id: string
  rewardCoins: number
  status: string
  createdAt: string
  referrer: { referralCode: string; phone?: string; name?: string }
  referred: { phone?: string; name?: string }
  order?: { status: string; total: number }
}

export default function AdminReferralsPage() {
  const [config, setConfig] = useState<ReferralConfig>({
    firstReferralCoins: 100,
    secondReferralCoins: 150,
    subsequentReferralCoins: 200,
  })
  const [referrals, setReferrals] = useState<ReferralRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function load() {
    const res = await fetchWithAuth(`${API}/api/v1/referrals`)
    const json = await res.json()
    if (json.data?.referrals) setReferrals(json.data.referrals)

    const cfgRes = await fetchWithAuth(`${API}/api/v1/referrals/config`)
    const cfgJson = await cfgRes.json()
    if (cfgJson.data) setConfig(cfgJson.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function saveConfig(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const res = await fetchWithAuth(`${API}/api/v1/referrals/config`, {
      method: 'PATCH',
      body: JSON.stringify(config),
    })
    setSaving(false)
    if (res.ok) setMessage('Reward tiers saved.')
    else setMessage('Failed to save.')
  }

  if (loading) return <p className="text-text-secondary">Loading…</p>

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Referrals</h1>

      <form onSubmit={saveConfig} className="bg-white rounded-2xl border border-surface p-6 mb-8 max-w-lg space-y-4">
        <h2 className="font-semibold text-text-primary">Reward tiers (coins)</h2>
        <p className="text-xs text-text-secondary">1 coin = ₹1 off at checkout</p>

        {(['firstReferralCoins', 'secondReferralCoins', 'subsequentReferralCoins'] as const).map((key, i) => (
          <div key={key}>
            <label className="text-xs font-semibold text-text-secondary block mb-1">
              {i === 0 ? '1st referral' : i === 1 ? '2nd referral' : '3rd+ referrals'}
            </label>
            <input
              type="number"
              min={1}
              value={config[key]}
              onChange={(e) => setConfig((c) => ({ ...c, [key]: Number(e.target.value) }))}
              className="w-full border border-surface rounded-xl px-3 py-2 text-sm"
            />
          </div>
        ))}

        {message && <p className="text-sm text-secondary">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save tiers'}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-surface overflow-hidden">
        <h2 className="font-semibold text-text-primary px-5 py-4 border-b border-surface">Recent referrals</h2>
        {referrals.length === 0 ? (
          <p className="text-center py-10 text-sm text-text-secondary">No referrals yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-text-secondary uppercase">
                <th className="px-5 py-3">Referrer</th>
                <th className="px-5 py-3">Referred</th>
                <th className="px-5 py-3">Coins</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r) => (
                <tr key={r.id} className="border-t border-surface">
                  <td className="px-5 py-3 font-mono text-xs">{r.referrer.referralCode}</td>
                  <td className="px-5 py-3">{r.referred.phone ?? r.referred.name ?? '—'}</td>
                  <td className="px-5 py-3">{r.rewardCoins || '—'}</td>
                  <td className="px-5 py-3 capitalize">{r.status}</td>
                  <td className="px-5 py-3 text-text-secondary">
                    {new Date(r.createdAt).toLocaleDateString('en-IN')}
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
