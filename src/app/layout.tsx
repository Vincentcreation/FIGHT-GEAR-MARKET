import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { DemoBanner } from "@/components/DemoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Fight Gear Market · Local Demo",
  description:
    "Local marketplace demo for Thai Muay Thai gear brands — fake catalog, cart, and commission simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <MarketplaceProvider>
          <div className="shell">
            <DemoBanner />
            <SiteHeader />
            <main className="shell__content">{children}</main>
            <SiteFooter />
          </div>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
