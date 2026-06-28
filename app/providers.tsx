'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthModal from './components/auth/AuthModal'
import CartHydrator from './components/cart/CartHydrator'
import ReferralSignupPrompt from './components/ReferralSignupPrompt'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={client}>
      <ReferralSignupPrompt />
      <CartHydrator />
      {children}
      <AuthModal />
    </QueryClientProvider>
  )
}
