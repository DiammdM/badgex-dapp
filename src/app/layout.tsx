import type { Metadata } from "next";
import { Exo_2, Orbitron } from "next/font/google";
import { defaultLanguage } from "./i18n";
import LayoutShell from "../components/LayoutShell";
import { LanguageProvider } from "@src/components/LanguageProvider";
import WalletProvider from "@src/components/WalletProvider";
import { Toaster } from "@src/components/ui/sonner";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const exo2 = Exo_2({
  variable: "--font-body",
  subsets: ["latin"],
});

const orbitron = Orbitron({
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
      className={`${exo2.variable} ${orbitron.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <div className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1200px_circle_at_15%_-10%,_#fff4d1_0%,_transparent_60%),radial-gradient(900px_circle_at_90%_10%,_#d9f4ee_0%,_transparent_55%),radial-gradient(700px_circle_at_40%_110%,_#f7d8c5_0%,_transparent_60%)] dark:bg-[radial-gradient(1200px_circle_at_12%_-15%,_rgba(34,211,238,0.22)_0%,_transparent_58%),radial-gradient(900px_circle_at_85%_8%,_rgba(244,63,94,0.18)_0%,_transparent_55%),radial-gradient(700px_circle_at_45%_120%,_rgba(168,85,247,0.16)_0%,_transparent_60%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-0 dark:opacity-55 mix-blend-soft-light bg-[linear-gradient(transparent_0,_rgba(255,255,255,0.04)_1px,_transparent_2px)] bg-[length:100%_6px]" />
          <LanguageProvider>
            <WalletProvider>
              <LayoutShell>{children}</LayoutShell>
            </WalletProvider>
          </LanguageProvider>
          <Toaster duration={1000} position="top-center" richColors />
        </div>
      </body>
    </html>
  );
}
