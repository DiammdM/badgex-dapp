import type { Metadata } from "next";
import { Fraunces, Sora } from "next/font/google";
import { defaultLanguage } from "./i18n";
import LayoutShell from "../components/LayoutShell";
import { LanguageProvider } from "@src/components/LanguageProvider";
import WalletProvider from "@src/components/WalletProvider";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const sora = Sora({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Badgex - Badge NFT Platform",
  description:
    "Create, mint, and trade badge NFTs with a streamlined creator workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLanguage}
      className={`${sora.variable} ${fraunces.variable}`}
    >
      <body className="bg-[#f7f2ea] text-slate-900 antialiased">
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_15%_-10%,_#fff4d1_0%,_transparent_60%),radial-gradient(900px_circle_at_90%_10%,_#d9f4ee_0%,_transparent_55%),radial-gradient(700px_circle_at_40%_110%,_#f7d8c5_0%,_transparent_60%)]" />
          <LanguageProvider>
            <WalletProvider>
              <LayoutShell>{children}</LayoutShell>
            </WalletProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
