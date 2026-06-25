import type { Metadata } from 'next'
import PolicyDocumentView from '@/app/components/policies/PolicyDocumentView'
import { refundPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Refund Policy | Aavya Foods',
  description: refundPolicy.description,
}

export default function RefundPolicyPage() {
  return <PolicyDocumentView document={refundPolicy} />
}
