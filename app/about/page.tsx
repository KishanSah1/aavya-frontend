import type { Metadata } from 'next'
import AboutPage from '@/app/components/about/AboutPage'

export const metadata: Metadata = {
  title: 'About Us | Aavya Foods',
  description:
    'From Rajasthan, with purity — our story of farmers, traditional Bilona ghee, and care in every drop. Aavya Foods.',
  openGraph: {
    title: 'About Aavya Foods | From Rajasthan, With Purity',
    description:
      'Traditional Bilona ghee, rooted in Rajasthan. No shortcuts — just pure ghee made the way it should be.',
  },
}

export default function AboutRoute() {
  return <AboutPage />
}
