export type User = {
  id: string;
  discordId?: string | null;
  email?: string | null;
};

export type DepositAddress = {
  id: string;
  userId: string;
  chain: "EVM" | "SOL" | "BTC" | "LTC";
  address: string;
  derivationIndex?: number | null;
};

export type Payment = {
  id: string;
  userId: string;
  chain: "EVM" | "SOL" | "BTC" | "LTC";
  asset: "ETH" | "USDT_ETH" | "SOL" | "BTC" | "LTC";
  txHash: string;
  txRef: string;
  amountAtomic: string;
  confirmations: number;
  status: "pending" | "confirmed" | "credited";
  createdAt: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3001";

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json();
}

export async function createUser(input: {
  discordId?: string | undefined;
  email?: string | undefined;
}): Promise<User> {
  const data = await apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user as User;
}

export async function getDepositAddress(userId: string, chain: DepositAddress["chain"]): Promise<DepositAddress> {
  const data = await apiFetch("/payments/deposit-address", {
    method: "POST",
    body: JSON.stringify({ userId, chain }),
  });
  return data.depositAddress as DepositAddress;
}

export async function listPayments(userId: string): Promise<Payment[]> {
  const data = await apiFetch(`/payments/${encodeURIComponent(userId)}`);
  return data.payments as Payment[];
}
