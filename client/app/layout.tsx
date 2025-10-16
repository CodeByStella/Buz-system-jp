import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DataProvider } from '@/lib/contexts'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ビジネスシステム',
  description: '業務効率化のためのビジネス管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  )
}
