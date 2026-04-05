import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Providers from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Aavya Foods | Pure A2 Bilona Ghee',
  description:
    'Experience the richness of traditionally crafted A2 Bilona Ghee, made from the milk of indigenous Desi cows. Farm fresh, 100% pure, and full of natural goodness.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased" style={{ backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
