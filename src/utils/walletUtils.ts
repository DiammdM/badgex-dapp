export function formatBalance(value: bigint, decimals: number) {
  if (decimals <= 0) {
    return `${value.toString()}.00`;
  }
  if (decimals === 1) {
    const integerPart = value / 10n;
    const fractionalPart = (value % 10n) * 10n;
    return `${integerPart.toString()}.${fractionalPart
      .toString()
      .padStart(2, "0")}`;
  }

  const factor = 10n ** BigInt(decimals - 2);
  let rounded = value / factor;
  if ((value % factor) * 2n >= factor) {
    rounded += 1n;
  }

  const integerPart = rounded / 100n;
  const fractionalPart = rounded % 100n;
  return `${integerPart.toString()}.${fractionalPart
    .toString()
    .padStart(2, "0")}`;
}

export function resolveChainId<const T extends readonly { id: number }[]>(
  chains: T,
  chainId?: number
): T[number]["id"] | undefined {
  if (typeof chainId !== "number") {
    return undefined;
  }

  const matchedChain = chains.find((chain) => chain.id === chainId);
  if (!matchedChain) {
    return undefined;
  }

  return matchedChain.id as T[number]["id"];
}
