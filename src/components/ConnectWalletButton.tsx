"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useBalance, useConnection } from "wagmi";
import { formatBalance } from "@src/utils/walletUtils";

type ConnectWalletButtonProps = {
  connectLabel: string;
  wrongNetworkLabel: string;
  avatarUrl?: string;
};

const passthroughImageLoader = ({ src }: { src: string }) => src;

export default function ConnectWalletButton({
  connectLabel,
  wrongNetworkLabel,
  avatarUrl,
}: ConnectWalletButtonProps) {
  const { address } = useConnection();

  const { data: balanceData } = useBalance({
    address,
    query: { enabled: Boolean(address) },
  });

  const buttonClass =
    "rounded-full border border-slate-900/20 bg-slate-900 px-5 py-2 text-sm font-semibold text-amber-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 cursor-pointer dark:border-cyan-400/40 dark:bg-cyan-500/25 dark:text-slate-900 dark:hover:bg-cyan-400/40 dark:shadow-[0_0_18px_rgba(34,211,238,0.45)]";

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;
        let balanceLabel = "—";
        if (balanceData) {
          const formattedBalance = formatBalance(
            balanceData.value,
            balanceData.decimals
          );
          balanceLabel = formattedBalance;
          if (balanceData.symbol) {
            balanceLabel = `${formattedBalance} ${balanceData.symbol}`;
          }
        }

        return (
          <div
            aria-hidden={!ready}
            className={
              !ready ? "pointer-events-none select-none opacity-0" : undefined
            }
          >
            {!connected ? (
              <button
                className={buttonClass}
                onClick={openConnectModal}
                type="button"
              >
                {connectLabel}
              </button>
            ) : chain.unsupported ? (
              <button
                className={buttonClass}
                onClick={openChainModal}
                type="button"
              >
                {wrongNetworkLabel}
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer dark:border-cyan-400/20 dark:bg-black/60 dark:text-slate-100 dark:backdrop-blur dark:hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                  onClick={openChainModal}
                  type="button"
                >
                  {chain.iconUrl ? (
                    <span
                      className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full"
                      style={{ background: chain.iconBackground }}
                    >
                      <Image
                        alt={chain.name ?? "Chain icon"}
                        className="h-6 w-6"
                        height={24}
                        loader={passthroughImageLoader}
                        src={chain.iconUrl}
                        unoptimized
                        width={24}
                      />
                    </span>
                  ) : (
                    <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700/60" />
                  )}
                  <span>{chain.name}</span>
                </button>
                <button
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer dark:border-cyan-400/20 dark:bg-black/60 dark:text-slate-100 dark:backdrop-blur dark:hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                  onClick={openAccountModal}
                  type="button"
                >
                  <span>{balanceLabel}</span>
                  <span
                    aria-hidden="true"
                    className="h-5 w-px bg-slate-200 dark:bg-white/10"
                  />
                  <span className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 dark:bg-white/10">
                    <Image
                      alt=""
                      className="h-6 w-6 rounded-full"
                      height={24}
                      loader={passthroughImageLoader}
                      src={avatarUrl as string}
                      unoptimized
                      width={24}
                    />
                    )<span>{account.displayName}</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
