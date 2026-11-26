import type { Metadata, Viewport } from "next";
import { DemoBanner } from "@/components/DemoBanner";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

export const metadata: Metadata = {
  title: "DILO",
  description: "Together, We Make Dreams Come True.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icons/icon-192.png", apple: "/icons/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a1440",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <DemoBanner />
        <RegisterSW />
        {children}
      </body>
    </html>
  );
}
