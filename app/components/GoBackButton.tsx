'use client'

import { ArrowLeft } from 'lucide-react'
import Button from '@/app/components/ui/Button'

export default function GoBackButton() {
  return (
    <Button
      variant="subtle"
      onClick={() => history.back()}
      leftIcon={<ArrowLeft className="w-4 h-4" />}
    >
      Go Back
    </Button>
  )
}
