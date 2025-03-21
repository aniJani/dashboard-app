import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Infolaya",
  description: "Visualization and Insights Dashboard",
  generator: 'v0.dev'
}

// Add viewport metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "w-full max-w-[100vw] overflow-x-hidden", // Prevent horizontal scroll
        inter.className
      )}>
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <link rel="icon" href="/favicon.png" />
        </div>
      </body>
    </html>
  )
}



import './globals.css'