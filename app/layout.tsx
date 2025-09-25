import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppProvider } from "@/contexts/app-context"
import { Navbar } from "@/components/layout/navbar"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "EduPlatform - Learn & Grow",
  description: "Comprehensive course and blog platform for modern learning",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            {children}
          </Suspense>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
}
