This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODO

- 中等：useWaitForTransactionReceipt 只传了 hash，用户发起交易后如果切链，会在错误链上等待，可能永远等不到收据。建议在提交时记录
  mintChainId，并在 useWaitForTransactionReceipt（以及 usePublicClient）里固定链。src/app/my-badges/page.tsx:183
- 中等：mintBadge 返回 tokenId，但当前逻辑没有任何地方取用；mintBadgeAsync 只返回 hash，收据回调只刷新列表。如果 /api/badges 不
  是链上索引，就会丢失 tokenId。src/app/my-badges/page.tsx:187, src/app/my-badges/page.tsx:364
- 低：交易上链但 revert 时，只给了通用错误。可以考虑在收到 reverted 后做一次 publicClient.call/simulateContract 来拿更具体的
  revert 信息。src/app/my-badges/page.tsx:187
- 低：你先 simulateContract，随后 mintBadgeAsync 可能还会做一次预模拟，导致重复 RPC，且链上状态变化时会产生“模拟通过但真正发送失
  败”的风险。src/app/my-badges/page.tsx:345, src/app/my-badges/page.tsx:364
