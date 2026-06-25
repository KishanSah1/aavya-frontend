'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'

export default function CartHydrator() {
  useEffect(() => {
    const unsub = useCartStore.persist.onFinishHydration(() => {
      useCartStore.getState().setHasHydrated(true)
    })

    if (useCartStore.persist.hasHydrated()) {
      useCartStore.getState().setHasHydrated(true)
    } else {
      useCartStore.persist.rehydrate()
    }

    return unsub
  }, [])

  return null
}
