import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Suspense } from "react"
import { Poppins } from "next/font/google"
import "./diwali.css"
import localFont from "next/font/local"
import Script from "next/script"
import GAButtonTracker from "@/components/ga-button-tracker"
const canela = localFont({
  src: [
    {
      path: "../../public/Canela-Bold.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-canela",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Happy Diwali Wishes",
  description: "Enjoy diwali with Arevei",
  openGraph: {
    title: "Happy Diwali Wishes",
    description: "Enjoy diwali with Arevei",
    url: "https://wish.arevei.com",
    type: "website",
    images: [
      "/og-image.png"
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Diwali Wishes",
    description: "Enjoy diwali with Arevei",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${canela.variable} ${poppins.variable}`}>
      <body className={`font-poppins ${GeistSans.variable} ${GeistMono.variable}`}>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-03NGFNELG8"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-03NGFNELG8');
          `}
        </Script>

        <GAButtonTracker />

        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
