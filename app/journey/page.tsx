import type { Metadata } from 'next'
import JourneyPage from '@/app/components/journey/JourneyPage'

export const metadata: Metadata = {
  title: 'The Journey | Aavya Foods',
  description:
    'Follow the traditional Bilona path — from hand-milked A2 cows to slow-cooked ghee. Five steps, zero shortcuts.',
  openGraph: {
    title: 'The Traditional Journey of Our Ghee | Aavya Foods',
    description: 'Milking, curd, wooden bilona churn, slow cooking, and packaging — pure A2 Bilona ghee.',
  },
}

export default function JourneyRoute() {
  return <JourneyPage />
}
