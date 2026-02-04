export async function parseJson<T>(request: Request): Promise<T> {
  return (await request.json()) as T;
}

export const parseChainId = (value: unknown): number | null => {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.trunc(value);
  }
  if (typeof value === "bigint") {
    if (value <= 0n) return null;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.trunc(numeric) : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const numeric = Number.parseInt(trimmed, 10);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }
  return null;
};
