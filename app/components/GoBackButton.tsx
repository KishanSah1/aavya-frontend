'use client'

import { ArrowLeft } from 'lucide-react'

export default function GoBackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 border border-surface text-text-secondary font-semibold px-6 py-3 rounded-full hover:border-secondary hover:text-secondary transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      Go Back
    </button>
  )
}
