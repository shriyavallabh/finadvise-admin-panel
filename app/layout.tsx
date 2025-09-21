import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ParticleBackground from '@/components/ui/ParticleBackground'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinAdvise Admin Panel',
  description: 'Multi-Agent AI System Management Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full`}>
        {/* Animated particle background */}
        <ParticleBackground />

        {/* Main content with proper z-index */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}