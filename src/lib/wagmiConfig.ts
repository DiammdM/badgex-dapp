import { createConfig, http, injected } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { defineChain } from "viem";
import { metaMask, walletConnect } from "wagmi/connectors";

const localChain = defineChain({
  id: 31337,
  name: "Localhost",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export const config = createConfig({
  chains: [mainnet, sepolia, localChain],

  // rpc channel
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC ?? "https://cloudflare-eth.com"
    ),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC ?? "https://rpc.sepolia.org"
    ),
    [localChain.id]: http("http://127.0.0.1:8545"),
  },

  ssr: true,

  // wallet connector
  connectors: [
    injected(),
    // Allow non-browser wallets to connect to dApps.
    // walletConnect({
    //   projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
    // }),
  ],
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
