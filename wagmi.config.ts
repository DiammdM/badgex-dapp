// badgex-dapp/wagmi.config.ts
import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import { badgeNftAbi } from "../badgex-contract/sdk/abi/BadgeNFT";

export default defineConfig({
  contracts: [
    {
      name: "BadgeNFT",
      abi: badgeNftAbi,
    },
  ],
  out: "src/generated/wagmi.ts",
  plugins: [react()],
});
