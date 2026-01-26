"use client";

import { darkTheme, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@src/lib/wagmiConfig";
import { useEffect, useMemo, useState } from "react";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Avoid creating a new QueryClient on every hot reload.
  const [queryClient] = useState(() => new QueryClient());
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const root = document.documentElement;
    const updateTheme = () => {
      setIsDark(root.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const rainbowTheme = useMemo(
    () =>
      isDark
        ? darkTheme({
            accentColor: "#22d3ee",
            accentColorForeground: "#05070d",
            borderRadius: "large",
          })
        : lightTheme({
            accentColor: "#0f172a",
            accentColorForeground: "#f8fafc",
            borderRadius: "large",
          }),
    [isDark]
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={rainbowTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
