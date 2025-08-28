import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ToastProvider } from "@/components/ToastProvider"
import { FloatingContactButton } from "@/components/ContactModal"

import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "AutoOrder – Mașini la comandă din licitații B2B",
    template: "%s | AutoOrder"
  },
  description: "Cumpărăm pentru tine din licitații B2B verificate. Transparență, raport tehnic, negociere și livrare până la ușă.",
  keywords: ["mașini", "licitații", "B2B", "auto", "vehicule", "sourcing", "europa", "buy now", "licitații B2B"],
  authors: [{ name: "AutoOrder" }],
  creator: "AutoOrder",
  publisher: "AutoOrder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://autoorder.ro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "https://autoorder.ro",
    title: "AutoOrder – Mașini la comandă din licitații B2B",
    description: "Cumpărăm pentru tine din licitații B2B verificate. Transparență, raport tehnic, negociere și livrare până la ușă.",
    siteName: "AutoOrder",
    images: [
      {
        url: "/og/autoorder.png",
        width: 1200,
        height: 630,
        alt: "AutoOrder - Mașini la comandă din licitații B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoOrder – Mașini la comandă din licitații B2B",
    description: "Cumpărăm pentru tine din licitații B2B verificate. Transparență, raport tehnic, negociere și livrare până la ușă.",
    images: ["/og/autoorder.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Schema.org Organization JSON-LD
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AutoOrder",
  "description": "Mașini la comandă din licitații B2B",
  "url": "https://autoorder.ro",
  "logo": "https://autoorder.ro/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+40-123-456-789",
    "contactType": "customer service",
    "areaServed": "RO",
    "availableLanguage": "Romanian"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "București",
    "addressCountry": "RO"
  },
  "sameAs": []
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro" className="overflow-x-hidden">
      <head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <FloatingContactButton />
            </div>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
