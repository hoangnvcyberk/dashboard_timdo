import type { Metadata } from "next"
import "@styles/globals.css"

export const metadata: Metadata = {
  title: "Theo dõi doanh thu",
  description: "Doanh thu timdo.io.vn",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  )
}
