import type { Metadata } from 'next'
import PolicyDocumentView from '@/app/components/policies/PolicyDocumentView'
import { shippingPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Shipping Policy | Aavya Foods',
  description: shippingPolicy.description,
}

export default function ShippingPolicyPage() {
  return <PolicyDocumentView document={shippingPolicy} />
}
