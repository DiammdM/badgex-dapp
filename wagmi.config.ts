// badgex-dapp/wagmi.config.ts
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { badgeNftAbi } from "../badgex-contract/sdk/abi/BadgeNFT";
import { marketplaceAbi } from "../badgex-contract/sdk/abi/Marketplace";

export default defineConfig({
  contracts: [
    {
      name: "BadgeNFT",
      abi: badgeNftAbi,
    },
    {
      name: "Marketplace",
      abi: marketplaceAbi,
    },
  ],
  out: "src/generated/wagmi.ts",
  plugins: [react()],
});
