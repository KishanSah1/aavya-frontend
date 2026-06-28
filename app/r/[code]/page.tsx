'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { markReferralPendingSignup, storeReferralCode } from '@/lib/referralStorage'

export default function ReferralRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const code = typeof params.code === 'string' ? params.code : ''

  useEffect(() => {
    if (code) {
      storeReferralCode(code)
      markReferralPendingSignup()
    }
    router.replace('/')
  }, [code, router])

  return null
}
