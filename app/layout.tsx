import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import ThemeToggle from '@/components/ui/ThemeToggle'

export const metadata: Metadata = {
  title: 'Task Magenament',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>

        <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeToggle/>

          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}