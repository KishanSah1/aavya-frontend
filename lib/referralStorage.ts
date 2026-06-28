const STORAGE_KEY = 'aavya-referral-code'
const PENDING_SIGNUP_KEY = 'aavya-referral-pending-signup'

export function storeReferralCode(code: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, code.toUpperCase().trim())
}

export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

export function clearStoredReferralCode() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

export function markReferralPendingSignup() {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(PENDING_SIGNUP_KEY, '1')
}

export function consumeReferralPendingSignup(): boolean {
  if (typeof window === 'undefined') return false
  const pending = sessionStorage.getItem(PENDING_SIGNUP_KEY) === '1'
  if (pending) sessionStorage.removeItem(PENDING_SIGNUP_KEY)
  return pending
}
