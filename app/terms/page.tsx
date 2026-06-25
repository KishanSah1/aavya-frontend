import type { Metadata } from 'next'
import PolicyDocumentView from '@/app/components/policies/PolicyDocumentView'
import { termsOfService } from '@/lib/policies'

export const metadata: Metadata = {
  title: 'Terms of Service | Aavya Foods',
  description: termsOfService.description,
}

export default function TermsOfServicePage() {
  return <PolicyDocumentView document={termsOfService} />
}
