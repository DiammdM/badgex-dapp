# 🧩 Badgex Dapp

A Next.js (App Router) dApp for creating, minting, and trading Badge NFTs. It includes a badge builder, IPFS metadata/image generation, a badge library, and a simple marketplace view powered by Next.js Route Handlers + Prisma (MongoDB).

## ✨ Features

- Badge builder with live SVG-to-PNG generation and IPFS upload
- Badge library with mint/list/cancel flows
- Marketplace listings + purchase activity
- Wallet connection and contract interaction via wagmi + viem
- Server-side API routes for data persistence

## 🧰 Tech Stack

- Next.js 16 (App Router)
- React 19, TypeScript, Tailwind CSS, shadcn/ui
- Prisma (MongoDB)
- wagmi + viem + RainbowKit
- Pinata IPFS SDK

## ✅ Prerequisites

- Node.js 18+ recommended
- pnpm
- MongoDB instance
- Deployed BadgeNFT + Marketplace contracts (testnet or local)
- Pinata account + JWT

## 🗂️ Project Structure

- `src/app/` Next.js routes and UI
- `src/app/api/` Next.js Route Handlers (server API)
- `src/server/` server-only data/infra logic (Prisma, IPFS)
- `prisma/schema.prisma` database schema (MongoDB)

## 📦 Install

```bash
pnpm install
```

### 🔗 Local contract package

This repo depends on a local package `@badgex/contracts` via:

```
@badgex/contracts: link:../badgex-contract
```

Make sure the sibling repo `../badgex-contract` exists and is built. If you prefer global linking instead, you can run:

```bash
# in ../badgex-contract
pnpm install
pnpm build
pnpm link --global

# in this repo
pnpm link --global @badgex/contracts
```

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```bash
# Database
DATABASE_URL="mongodb+srv://USER:PASSWORD@HOST/DB?retryWrites=true&w=majority"

# IPFS / Pinata
PINATA_JWT="<pinata-jwt>"
NEXT_PUBLIC_GATEWAY_URL="https://gateway.pinata.cloud"
GROUP_ID="<pinata-group-id>"
IPFS_PIC_PREFIX="https://gateway.pinata.cloud/ipfs/"

# Mint signature (server-only)
ISSUER_PRIVATE_KEY="0x..."

# Contract addresses (client + server)
NEXT_PUBLIC_BADGE_NFT_ADDRESS="0x..."
NEXT_PUBLIC_BADGE_MARKETPLACE_ADDRESS="0x..."

# RPC overrides (optional)
NEXT_PUBLIC_MAINNET_RPC="https://..."
NEXT_PUBLIC_SEPOLIA_RPC="https://..."
```

Notes:

- `ISSUER_PRIVATE_KEY` is used by `/api/mint-signature` to sign mint payloads. Keep it server-only.
- `NEXT_PUBLIC_*` variables are exposed to the client.
- `IPFS_PIC_PREFIX` is used to build image URLs from CIDs.

## 🗄️ Database (MongoDB + Prisma)

After setting `DATABASE_URL`, sync schema:

```bash
pnpm prisma db push
```

(Optional) Generate Prisma client if needed:

```bash
pnpm prisma generate
```

## ▶️ Running Locally

```bash
pnpm dev
```

Open `http://localhost:3000`.

## 🏗️ Build & Start

```bash
pnpm build
pnpm start
```

## 🧹 Lint

```bash
pnpm lint
```

## ⛓️ Chain Configuration

Chain config lives in `src/lib/wagmiConfig.ts`:

- Mainnet, Sepolia, and Localhost (31337) are supported.
- Local node expected at `http://127.0.0.1:8545`.

To connect to a chain:

1. Deploy `BadgeNFT` and `Marketplace` contracts.
2. Set `NEXT_PUBLIC_BADGE_NFT_ADDRESS` and `NEXT_PUBLIC_BADGE_MARKETPLACE_ADDRESS`.
3. Provide RPC URLs if you don’t want to use the defaults.
4. Connect a wallet in the UI.

## 🧭 API Routes

All APIs are implemented under `src/app/api`:

- `GET /api/badges?userId=...`
- `POST /api/badges`
- `PATCH /api/badges/:id`
- `DELETE /api/badges/:id`
- `PATCH /api/badges/by-token-uri`
- `GET /api/badges/by-token-id?tokenId=...`
- `GET /api/badges/explore?limit&offset&search&category&theme&shape&icon`
- `GET /api/badges/market?limit&offset&search`
- `GET /api/badges/market/activity?limit&offset`
- `POST /api/badges/market/purchase`
- `POST /api/mint-signature`

## 🚀 Deployment

### ☁️ Vercel

- Set the same environment variables in your Vercel project.
- Ensure MongoDB and Pinata credentials are available at build/runtime.
- Build command: `pnpm build`
- Output: Next.js default

### 🖥️ Self-Hosted

```bash
pnpm build
pnpm start
```

Make sure the server has access to:

- MongoDB (`DATABASE_URL`)
- Pinata (`PINATA_JWT`, `GROUP_ID`, `NEXT_PUBLIC_GATEWAY_URL`)
- Private key for signing (`ISSUER_PRIVATE_KEY`)

## 📝 Notes

- Contract-level requirements and specs live in `doc/`.
- This repo focuses on UI + API; smart contract logic lives in the separate contract repo.

## 📄 License

TBD
