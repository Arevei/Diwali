import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Suspense } from "react"
import { Salsa, Style_Script } from "next/font/google"
import "./diwali.css"

const salsa = Salsa({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-salsa",
})
const styleScript = Style_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-style-script",
})

export const metadata: Metadata = {
  title: "Happy Diwali Wishes",
  description: "Enjoy  diwali with Arevei",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${salsa.variable} ${styleScript.variable}`}>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
