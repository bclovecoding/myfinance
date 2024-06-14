import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import QueryProvider from '@/providers/query-provider'
import SheetProvider from '@/providers/sheet-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | My Finance',
    default: 'My Finance',
  },
  description: 'Track your daily finance transactions.',
  metadataBase: new URL('http://localhost:3000'),
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/icons/favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '57x57',
      url: '/icons/touch-icon-iphone.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '57x57',
      url: '/icons/touch-icon-iphone.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '72x72',
      url: '/icons/touch-icon-ipad.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '114x114',
      url: '/icons/touch-icon-iphone4.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '144x144',
      url: '/icons/apple-touch-icon-ipad3-144.png',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <QueryProvider>
            <SheetProvider />
            <Toaster richColors />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
