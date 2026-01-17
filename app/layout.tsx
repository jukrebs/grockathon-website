import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grok AR',
  description: 'Generate 3D objects from text and view them in AR',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
