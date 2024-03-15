import type { Metadata } from 'next'

import { Toaster } from '@/components/ui/toaster'
import { GeistSans } from 'geist/font/sans'

import NextAuthSessionProvider from '../../providers/NextAuthSessionProvider'
import { ThemeProvider } from '../../providers/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ametista',
  description: 'Uma plataforma para gerenciar suas finanças pessoais.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <NextAuthSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
