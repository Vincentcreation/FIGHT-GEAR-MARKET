import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import { DemoBanner } from "@/components/DemoBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { MarketplaceProvider } from "@/context/MarketplaceContext";
import { PortalProvider } from "@/context/PortalContext";
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
  title: "Fight Gear Market",
  description:
    "Explore a demo marketplace for martial arts equipment and apparel, starting with Muay Thai gloves, shorts, and hand wraps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <PortalProvider>
          <MarketplaceProvider>
            <div className="shell">
              <DemoBanner />
              <SiteHeader />
              <main className="shell__content">{children}</main>
              <SiteFooter />
            </div>
          </MarketplaceProvider>
        </PortalProvider>
      </body>
    </html>
  );
}
