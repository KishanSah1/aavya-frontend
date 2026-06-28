'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import { consumeReferralPendingSignup } from '@/lib/referralStorage'

export default function ReferralSignupPrompt() {
  const user = useAuthStore((s) => s.user)
  const openModal = useAuthStore((s) => s.openModal)

  useEffect(() => {
    if (user) return
    if (!consumeReferralPendingSignup()) return
    openModal()
  }, [user, openModal])

  return null
}
