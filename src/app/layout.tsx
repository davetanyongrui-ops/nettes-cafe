import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: "Nette's Cafe & Health Hub",
    template: "%s | Nette's Cafe"
  },
  description: "Nourishing hospital staff, patients, and the community with farm-fresh, natural ingredients and from-scratch meals.",
  keywords: ["healthy cafe", "hospital food", "natural ingredients", "Nette's Cafe", "meal prep", "salads", "soups"],
  openGraph: {
    title: "Nette's Cafe & Health Hub",
    description: "Nourishing the community with healthy, delicious, from-scratch meals.",
    url: "https://nettescafe.com",
    siteName: "Nette's Cafe",
    locale: "en_SG",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased font-sans text-stone-900 bg-stone-50`}>
        {children}
      </body>
    </html>
  )
}

