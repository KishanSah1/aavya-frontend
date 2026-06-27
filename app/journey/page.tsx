import type { Metadata } from 'next'
import JourneyPage from '@/app/components/journey/JourneyPage'

export const metadata: Metadata = {
  title: 'The Journey | Aavya Foods',
  description:
    'Follow the traditional Bilona path — from hand-milked desi cows to slow-cooked ghee. Five steps, zero shortcuts.',
  openGraph: {
    title: 'The Traditional Journey of Our Ghee | Aavya Foods',
    description: 'Milking, curd, wooden bilona churn, slow cooking, and packaging — pure Bilona ghee.',
  },
}

export default function JourneyRoute() {
  return <JourneyPage />
}
