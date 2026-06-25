import type { Metadata } from 'next'
import PolicyDocumentView from '@/app/components/policies/PolicyDocumentView'
import { privacyPolicy } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Privacy Policy | Aavya Foods',
  description: privacyPolicy.description,
}

export default function PrivacyPolicyPage() {
  return <PolicyDocumentView document={privacyPolicy} />
}
