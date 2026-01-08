import fs from "node:fs";
import path from "node:path";
import { ethers } from "ethers";
import { badgeNftAbi } from "../src/generated/wagmi";

type EnvMap = Record<string, string>;

const loadEnvFile = (filePath: string) => {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
};

const readEnv = (): EnvMap => {
  const envPath = path.resolve(process.cwd(), ".env.development");
  loadEnvFile(envPath);

  const envMap: EnvMap = {};
  Object.keys(process.env).forEach((key) => {
    const value = process.env[key];
    if (typeof value === "string") {
      envMap[key] = value;
    }
  });
  return envMap;
};

// const resolveRpcUrl = (env: EnvMap) =>
//   env.NEXT_PUBLIC_MAINNET_RPC ||
//   env.NEXT_PUBLIC_SEPOLIA_RPC ||
//   env.NEXT_PUBLIC_RPC_URL ||
//   env.RPC_URL;
const resolveRpcUrl = (env: EnvMap) => "http://127.0.0.1:8545";

const main = async () => {
  const env = readEnv();
  const contractAddress = env.BADGE_NFT_ADDRESS;
  const issuerPrivateKey = env.ISSUER_PRIVATE_KEY;
  const rpcUrl = resolveRpcUrl(env);

  if (!contractAddress || !issuerPrivateKey || !rpcUrl) {
    console.error("Missing required environment variables.");
    console.error(
      "Required: BADGE_NFT_ADDRESS, ISSUER_PRIVATE_KEY, and one RPC URL."
    );
    console.error(
      "RPC URL candidates: NEXT_PUBLIC_MAINNET_RPC, NEXT_PUBLIC_SEPOLIA_RPC, NEXT_PUBLIC_RPC_URL, RPC_URL."
    );
    process.exitCode = 1;
    return;
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, badgeNftAbi, provider);
  const network = await provider.getNetwork();
  const code = await provider.getCode(contractAddress);
  if (!code || code === "0x") {
    console.error("No contract code found at the address.");
    console.error("Check RPC chain and BADGE_NFT_ADDRESS.");
    console.error("RPC chainId:", network.chainId.toString());
    console.error("Contract:", contractAddress);
    process.exitCode = 1;
    return;
  }

  let onchainIssuer: string;
  try {
    onchainIssuer = await contract.issuer();
  } catch (error) {
    console.error("Failed to read issuer() from contract.");
    console.error("RPC chainId:", network.chainId.toString());
    console.error("Contract:", contractAddress);
    console.error("Reason:", error);
    process.exitCode = 1;
    return;
  }
  const localIssuer = new ethers.Wallet(issuerPrivateKey).address;

  const onchainIssuerChecksum = ethers.getAddress(onchainIssuer);
  const localIssuerChecksum = ethers.getAddress(localIssuer);

  console.log("Contract:", contractAddress);
  console.log("On-chain issuer:", onchainIssuerChecksum);
  console.log("Local issuer:", localIssuerChecksum);

  if (onchainIssuerChecksum !== localIssuerChecksum) {
    console.error("Issuer mismatch.");
    process.exitCode = 1;
    return;
  }

  console.log("Issuer match.");
};

main().catch((error) => {
  console.error("Failed to check issuer:", error);
  process.exitCode = 1;
});
