import type { Metadata, Viewport } from "next";
import { DemoBanner } from "@/components/DemoBanner";
import { RegisterSW } from "@/components/RegisterSW";
import { DemoProvider } from "@/lib/demo/store";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "DILO",
  description: "Together, We Make Dreams Come True.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
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
