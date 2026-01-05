import { createConfig, http, injected } from "wagmi";
import { mainnet, sepolia, localhost } from "wagmi/chains";
import { metaMask, walletConnect } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia, localhost],

  // rpc channel
  transports: {
    [mainnet.id]: http(
      process.env.NEXT_PUBLIC_MAINNET_RPC ?? "https://cloudflare-eth.com"
    ),
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC ?? "https://rpc.sepolia.org"
    ),
    [localhost.id]: http("http://127.0.0.1:8545"),
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
