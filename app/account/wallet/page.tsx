'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Coins, Gift, Share2 } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { useAuthStore } from '@/lib/store/authStore'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface WalletData {
  coinBalance: number
  coinsReserved?: number
  availableCoinBalance?: number
  referralCode: string
  successfulReferrals: number
  nextReferralReward: number
  referralLink: string
}

interface CoinTransaction {
  id: string
  amount: number
  type: string
  balanceAfter: number
  note?: string
  createdAt: string
  order?: { id: string; total: number; status: string } | null
  referral?: { id: string; rewardCoins: number; status: string } | null
}

const TYPE_LABELS: Record<string, string> = {
  REFERRAL_EARN: 'Referral reward',
  REFERRAL_REVERSAL: 'Referral reversed',
  REDEMPTION: 'Used on order',
  REDEMPTION_REFUND: 'Order refund',
  RESERVE: 'Coins reserved',
  RESERVE_RELEASE: 'Reservation released',
  ADMIN_ADJUST: 'Admin adjustment',
}

export default function WalletPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [transactions, setTransactions] = useState<CoinTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<'code' | 'link' | null>(null)

  useEffect(() => {
    if (!user) {
      router.replace('/')
      return
    }

    Promise.all([
      fetchWithAuth(`${API}/api/v1/wallet`).then((r) => r.json()),
      fetchWithAuth(`${API}/api/v1/wallet/transactions`).then((r) => r.json()),
    ])
      .then(([walletRes, txRes]) => {
        setWallet(walletRes.data)
        setTransactions(txRes.data ?? [])
      })
      .finally(() => setLoading(false))
  }, [user, router])

  async function copy(text: string, kind: 'code' | 'link') {
    await navigator.clipboard.writeText(text)
    setCopied(kind)
    setTimeout(() => setCopied(null), 2000)
  }

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF7] flex items-center justify-center text-text-secondary">
        Loading wallet…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFCF7]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <h1 className="text-3xl font-extrabold text-text-primary mb-2">Wallet & Referrals</h1>
        <p className="text-text-secondary text-sm mb-8">Earn coins when friends shop. Use coins at checkout (1 coin = ₹1).</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-white border border-surface p-6">
            <div className="flex items-center gap-2 text-secondary mb-2">
              <Coins className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Coin balance</span>
            </div>
            <p className="text-4xl font-extrabold text-text-primary">
              {wallet?.availableCoinBalance ?? wallet?.coinBalance ?? 0}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              coins available
              {(wallet?.coinsReserved ?? 0) > 0 && (
                <span className="block text-xs mt-0.5">
                  {wallet!.coinsReserved} reserved for pending checkout
                </span>
              )}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-surface p-6">
            <div className="flex items-center gap-2 text-secondary mb-2">
              <Gift className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Referrals</span>
            </div>
            <p className="text-4xl font-extrabold text-text-primary">{wallet?.successfulReferrals ?? 0}</p>
            <p className="text-sm text-text-secondary mt-1">
              Next referral earns <span className="font-semibold text-secondary">{wallet?.nextReferralReward ?? 0} coins</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-surface p-6 mb-8 space-y-4">
          <h2 className="font-bold text-text-primary flex items-center gap-2">
            <Share2 className="w-4 h-4 text-secondary" /> Share your code
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 rounded-xl bg-surface px-4 py-3 font-mono font-bold tracking-wider text-text-primary">
              {wallet?.referralCode}
            </div>
            <button
              type="button"
              onClick={() => copy(wallet?.referralCode ?? '', 'code')}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-secondary text-white text-sm font-semibold"
            >
              <Copy className="w-4 h-4" />
              {copied === 'code' ? 'Copied!' : 'Copy code'}
            </button>
          </div>
          <button
            type="button"
            onClick={() => copy(wallet?.referralLink ?? '', 'link')}
            className="text-sm text-secondary font-semibold underline"
          >
            {copied === 'link' ? 'Link copied!' : 'Copy referral link'}
          </button>
          <p className="text-xs text-text-secondary">
            Friends must enter your code when signing up. You earn coins when they complete their first purchase.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-surface overflow-hidden">
          <h2 className="font-bold text-text-primary px-6 py-4 border-b border-surface">Transaction history</h2>
          {transactions.length === 0 ? (
            <p className="text-center py-10 text-sm text-text-secondary">No transactions yet.</p>
          ) : (
            <ul className="divide-y divide-surface">
              {transactions.map((tx) => (
                <li key={tx.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{TYPE_LABELS[tx.type] ?? tx.type}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`font-bold tabular-nums ${tx.amount >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {tx.amount >= 0 ? '+' : ''}{tx.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
