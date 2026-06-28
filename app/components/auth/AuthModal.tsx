'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { useCartStore } from '@/lib/store/cartStore'
import { getStoredReferralCode, clearStoredReferralCode } from '@/lib/referralStorage'
import Button from '@/app/components/ui/Button'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

const VALUE_CARDS = [
  { emoji: '🧈', title: 'Pure', sub: 'No shortcuts, no compromise' },
  { emoji: '🐄', title: 'Traditional', sub: 'Bilona method, every time' },
  { emoji: '✨', title: 'Trusted', sub: '5,000+ families can\'t be wrong' },
]

type Step = 'auth' | 'signup' | 'name'

export default function AuthModal() {
  const { isModalOpen, closeModal, setAuth } = useAuthStore()
  const syncOnLogin = useCartStore((s) => s.syncOnLogin)

  const [step, setStep] = useState<Step>('auth')
  const [phone, setPhone] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(['', '', '', ''])
  const [name, setName] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [showReferralField, setShowReferralField] = useState(false)
  const [referralFromLink, setReferralFromLink] = useState(false)
  const [signupToken, setSignupToken] = useState('')
  const [pendingAuth, setPendingAuth] = useState<{ user: Parameters<typeof setAuth>[0], accessToken: string, refreshToken: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!isModalOpen) return
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && handleClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isModalOpen])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  function resetForm() {
    setStep('auth')
    setPhone('')
    setOtpSent(false)
    setOtp(['', '', '', ''])
    setName('')
    setReferralCode('')
    setShowReferralField(false)
    setReferralFromLink(false)
    setSignupToken('')
    setPendingAuth(null)
    setError('')
    setResendTimer(0)
  }

  function handleClose() {
    closeModal()
    resetForm()
  }

  function prepareSignupStep() {
    const stored = getStoredReferralCode()
    if (stored) {
      setReferralCode(stored)
      setShowReferralField(true)
      setReferralFromLink(true)
    } else {
      setReferralCode('')
      setShowReferralField(false)
      setReferralFromLink(false)
    }
    setStep('signup')
  }

  async function handleSendOtp(e?: React.FormEvent) {
    e?.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length !== 10) {
      setError('Enter a valid 10-digit number')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${cleaned}` }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Failed to send OTP')
        return
      }
      setOtpSent(true)
      setResendTimer(30)
      setOtp(['', '', '', ''])
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 4) {
      setError('Enter the full 4-digit OTP')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: `+91${phone.replace(/\D/g, '')}`,
          code,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Invalid OTP')
        return
      }

      if (json.data.isNewUser) {
        setSignupToken(json.data.signupToken)
        prepareSignupStep()
        return
      }

      if (!json.data.user.name) {
        setPendingAuth({
          user: json.data.user,
          accessToken: json.data.accessToken,
          refreshToken: json.data.refreshToken,
        })
        setStep('name')
      } else {
        setAuth(json.data.user, json.data.accessToken, json.data.refreshToken)
        await syncOnLogin()
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !signupToken) return
    setError('')
    setLoading(true)
    try {
      const body: Record<string, string> = {
        signupToken,
        name: name.trim(),
      }
      if (referralCode.trim()) body.referralCode = referralCode.trim().toUpperCase()

      const res = await fetch(`${API}/api/v1/auth/complete-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Signup failed')
        return
      }

      if (referralCode.trim()) clearStoredReferralCode()
      setAuth(json.data.user, json.data.accessToken, json.data.refreshToken)
      await syncOnLogin()
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !pendingAuth) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/auth/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pendingAuth.accessToken}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Failed to save name')
        return
      }
      setAuth(
        { ...pendingAuth.user, name: name.trim() },
        pendingAuth.accessToken,
        pendingAuth.refreshToken
      )
      await syncOnLogin()
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs.current[i - 1]?.focus()
    }
  }

  function handleOtpChange(i: number, val: string) {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[i] = digit
    setOtp(next)
    if (digit && i < 3) otpRefs.current[i + 1]?.focus()
  }

  async function handleResend() {
    if (resendTimer > 0) return
    await handleSendOtp()
  }

  if (!isModalOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[420px]">
        <div className="relative flex flex-col justify-between bg-[#F5E9C8] px-8 py-10 md:w-[52%]">
          <div>
            <Image
              src="/aavya/logo.jpeg"
              alt="Aavya Foods"
              width={140}
              height={60}
              className="object-contain h-12 w-auto mb-8"
            />
            <h2 className="text-2xl font-extrabold text-[#3B2A1A] leading-snug mb-8">
              Login now to avail<br />best offers!
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {VALUE_CARDS.map((c) => (
              <div
                key={c.title}
                className="flex flex-col items-center text-center bg-[#EDD99A]/60 rounded-2xl px-3 py-5 gap-2"
              >
                <span className="text-3xl">{c.emoji}</span>
                <p className="font-bold text-[#3B2A1A] text-sm leading-tight">{c.title}</p>
                <p className="text-[#6B4C2A] text-xs leading-snug">{c.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col justify-center bg-white px-8 py-10 md:w-[48%]">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-text-secondary hover:bg-surface transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {step === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Create your account</h3>
                <p className="text-sm text-text-secondary">Almost done — tell us your name</p>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
                autoFocus
                className="border border-surface rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
              />

              {referralFromLink && showReferralField && (
                <p className="text-xs text-secondary bg-secondary/10 rounded-lg px-3 py-2">
                  Referral code applied — you can edit or remove it below.
                </p>
              )}

              {showReferralField ? (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-text-secondary">Referral code (optional)</label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="AAVYA-XXXXXX"
                    className="border border-surface rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:ring-2 focus:ring-secondary/30 transition-all uppercase"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowReferralField(true)}
                  className="text-sm text-secondary font-medium text-left hover:underline"
                >
                  Have a friend&apos;s referral code?
                </button>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" disabled={loading || !name.trim()} fullWidth size="lg" variant="outline">
                {loading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>
          ) : step === 'name' ? (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">What&apos;s your name?</h3>
                <p className="text-sm text-text-secondary">Help us personalise your experience</p>
              </div>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                maxLength={100}
                autoFocus
                className="border border-surface rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" disabled={loading || !name.trim()} fullWidth size="lg" variant="outline">
                {loading ? 'Saving…' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">Login or Register</h3>
                <p className="text-sm text-text-secondary">
                  {otpSent
                    ? `Enter the OTP sent to +91 ${phone.replace(/\D/g, '')}`
                    : "We'll send a one-time OTP to your mobile"}
                </p>
              </div>

              <div className="flex items-center border border-surface rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-secondary/30 transition-all bg-white">
                <div className="flex items-center gap-2 px-4 py-3 border-r border-surface text-sm font-medium text-text-primary shrink-0 bg-[#FAFAF8]">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Mobile Number"
                  disabled={otpSent}
                  className="flex-1 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none bg-transparent disabled:opacity-60"
                  autoFocus
                />
                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtp(['', '', '', ''])
                      setError('')
                    }}
                    className="px-3 text-xs text-secondary underline shrink-0"
                  >
                    Change
                  </button>
                )}
              </div>

              {otpSent && (
                <>
                  <div className="flex gap-2.5 justify-between">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el }}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20 border-surface text-text-primary"
                      />
                    ))}
                  </div>

                  <p className="text-center text-sm text-text-secondary -mt-2">
                    Didn&apos;t receive it?{' '}
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTimer > 0}
                      className="text-secondary font-medium disabled:text-text-secondary/50"
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </p>
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" disabled={loading} fullWidth size="lg" variant="outline">
                {loading
                  ? otpSent
                    ? 'Verifying…'
                    : 'Sending OTP…'
                  : otpSent
                    ? 'Verify & Continue'
                    : 'Send OTP'}
              </Button>

              {!otpSent && (
                <p className="text-center text-xs text-text-secondary leading-relaxed">
                  I accept that I have read & understood your{' '}
                  <span className="underline cursor-pointer">Privacy Policy</span>{' '}
                  and{' '}
                  <span className="underline cursor-pointer">T&Cs.</span>
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
