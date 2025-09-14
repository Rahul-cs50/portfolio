import type { Metadata } from "next"
import "./globals.css"
import { Press_Start_2P } from "next/font/google"

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Rahul’s Journey",
  description: "Retro traveler portfolio",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ""

  return (
    <html lang="en">
      <head>
        {/* Inject --base CSS var for assets */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--base:${base.endsWith("/") ? base : base + "/"} }`,
          }}
        />
      </head>
      <body className={`${pressStart.className} text-white`}>
        {children}
      </body>
    </html>
  )
}