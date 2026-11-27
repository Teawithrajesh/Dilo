import type { Metadata, Viewport } from "next";
import { DemoBanner } from "@/components/DemoBanner";
import { RegisterSW } from "@/components/RegisterSW";
import { DemoProvider } from "@/lib/demo/store";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/500-italic.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/600-italic.css";
import "./globals.css";

const SLOGAN = "Together, We Make Dreams Come True.";

// Link previews (WhatsApp, Facebook, X): DILO image + slogan.
// Set NEXT_PUBLIC_SITE_URL to the real address once DILO is hosted; previews need a public address.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dilowish.com"),
  title: "DILO",
  description: SLOGAN,
  manifest: "/manifest.webmanifest",
  // Prototype: keep it out of search results.
  robots: { index: false, follow: false },
  icons: {
    icon: [{ url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "DILO",
    title: "DILO — " + SLOGAN,
    description: "A private space for your family's birthdays, engagements, weddings and anniversaries.",
    images: [{ url: "/og/dilo-share.png", width: 1200, height: 630, alt: "DILO — " + SLOGAN }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DILO — " + SLOGAN,
    description: "A private space for your family's celebrations.",
    images: ["/og/dilo-share.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1440",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-navy antialiased">
        <DemoBanner />
        <RegisterSW />
        <DemoProvider>{children}</DemoProvider>
      </body>
    </html>
  );
}
