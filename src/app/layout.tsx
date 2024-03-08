import type { Metadata } from 'next'
import localFont from 'next/font/local'

import { Toaster } from '@/components/ui/toaster'

import NextAuthSessionProvider from '../../providers/NextAuthSessionProvider'
import { ThemeProvider } from '../../providers/theme-provider'
import './globals.css'

const myFont = localFont({
  src: './../../fonts/CalSans-SemiBold.woff2',
})

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
      <body className={myFont.className}>
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
