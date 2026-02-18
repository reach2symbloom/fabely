import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Fabely — Where Manuscripts Attract Meaning',
  description:
    'Fabely is an AI-powered writing environment that unifies research, notes, and manuscript writing through a semantic pattern engine. Write fiction and non-fiction with intelligence that surfaces exactly when you need it.',
  keywords: ['writing tool', 'manuscript', 'AI writing', 'novel writing', 'semantic engine', 'fiction writing'],
  openGraph: {
    title: 'Fabely — Where Manuscripts Attract Meaning',
    description: 'The AI-powered writing environment for fiction and non-fiction authors.',
    siteName: 'Fabely',
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#1a1612',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_inter.variable} ${_playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
