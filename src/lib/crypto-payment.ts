/**
 * Crypto Payment System — USDT TRC20 (Tron) + ERC20 (Ethereum)
 * MODE=mock:  instant confirmation for development
 * MODE=real:  live blockchain verification via TronGrid / Etherscan
 */

export type PaymentNetwork = "TRON" | "ETHEREUM";
export type PaymentStatus = "PENDING" | "CONFIRMING" | "CONFIRMED" | "FAILED" | "EXPIRED";

export interface PaymentDetails {
  toAddress: string;
  network: PaymentNetwork;
  amountUsdt: number;
  reference: string;
  expiresAt: Date;
}

export interface VerificationResult {
  verified: boolean;
  txHash?: string;
  fromAddress?: string;
  amountUsdt?: number;
  blockConfirmations?: number;
  error?: string;
}

// ─── Address resolver ──────────────────────────────────────────────────────

export function getReceivingAddress(network: PaymentNetwork): string {
  if (network === "TRON") {
    return process.env.TRON_WALLET_ADDRESS || "TPlaceholderTronAddressHere123456";
  }
  return process.env.ETH_WALLET_ADDRESS || "0xPlaceholderEthAddressHere";
}

// ─── Payment initiation ────────────────────────────────────────────────────

export function createPaymentDetails(
  network: PaymentNetwork,
  amountUsdt: number,
  reference: string
): PaymentDetails {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2); // 2h payment window

  return {
    toAddress: getReceivingAddress(network),
    network,
    amountUsdt,
    reference,
    expiresAt,
  };
}

// ─── Mock verification (dev/demo mode) ────────────────────────────────────

function mockVerify(reference: string): VerificationResult {
  return {
    verified: true,
    txHash: `mock_tx_${reference}_${Date.now()}`,
    fromAddress: "TMockSenderAddress123456789",
    amountUsdt: parseFloat(process.env.SUBSCRIPTION_PRICE_USDT || "29.99"),
    blockConfirmations: 20,
  };
}

// ─── TronGrid (TRC20) verification ────────────────────────────────────────

async function verifyTRC20(
  txHash: string,
  expectedAddress: string,
  expectedAmount: number
): Promise<VerificationResult> {
  const apiKey = process.env.TRON_API_KEY;
  const baseUrl = process.env.TRONGRID_API_URL || "https://api.trongrid.io";

  if (!apiKey) {
    return { verified: false, error: "TRON_API_KEY not configured" };
  }

  try {
    const response = await fetch(
      `${baseUrl}/v1/transactions/${txHash}`,
      {
        headers: {
          "TRON-PRO-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { verified: false, error: `TronGrid API error: ${response.status}` };
    }

    const data = await response.json();
    const tx = data.data?.[0];

    if (!tx) {
      return { verified: false, error: "Transaction not found" };
    }

    // Check it's a TRC20 USDT transfer
    const contract = tx.raw_data?.contract?.[0];
    if (!contract || contract.type !== "TriggerSmartContract") {
      return { verified: false, error: "Not a smart contract call" };
    }

    const parameter = contract.parameter?.value;
    if (!parameter) {
      return { verified: false, error: "Missing contract parameter" };
    }

    // USDT TRC20 contract on mainnet
    const USDT_TRC20 = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    if (parameter.contract_address !== USDT_TRC20) {
      return { verified: false, error: "Not a USDT TRC20 transfer" };
    }

    const toAddress = parameter.to_address || "";
    const amount = (parameter.amount || 0) / 1_000_000; // USDT has 6 decimals on Tron

    if (toAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      return { verified: false, error: "Wrong recipient address" };
    }

    const tolerance = 0.01;
    if (Math.abs(amount - expectedAmount) > tolerance) {
      return {
        verified: false,
        error: `Wrong amount. Expected ${expectedAmount}, got ${amount}`,
      };
    }

    const confirmations = tx.confirmations || 0;
    if (confirmations < 10) {
      return {
        verified: false,
        txHash,
        blockConfirmations: confirmations,
        error: "Not enough confirmations (need 10+)",
      };
    }

    return {
      verified: true,
      txHash,
      fromAddress: parameter.owner_address,
      amountUsdt: amount,
      blockConfirmations: confirmations,
    };
  } catch (err) {
    return {
      verified: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ─── Etherscan (ERC20) verification ───────────────────────────────────────

async function verifyERC20(
  txHash: string,
  expectedAddress: string,
  expectedAmount: number
): Promise<VerificationResult> {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const baseUrl = process.env.ETHERSCAN_API_URL || "https://api.etherscan.io/api";

  if (!apiKey) {
    return { verified: false, error: "ETHERSCAN_API_KEY not configured" };
  }

  try {
    const params = new URLSearchParams({
      module: "transaction",
      action: "gettxreceiptstatus",
      txhash: txHash,
      apikey: apiKey,
    });

    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();

    if (data.status !== "1" || data.result?.status !== "1") {
      return { verified: false, error: "Transaction failed or not found" };
    }

    // Fetch token transfer info
    const tokenParams = new URLSearchParams({
      module: "account",
      action: "tokentx",
      contractaddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT ERC20
      address: expectedAddress,
      page: "1",
      offset: "10",
      sort: "desc",
      apikey: apiKey,
    });

    const tokenResponse = await fetch(`${baseUrl}?${tokenParams}`);
    const tokenData = await tokenResponse.json();

    const transfer = (tokenData.result || []).find(
      (tx: { hash: string }) => tx.hash.toLowerCase() === txHash.toLowerCase()
    );

    if (!transfer) {
      return { verified: false, error: "USDT transfer not found for this tx" };
    }

    const amount = parseFloat(transfer.value) / 1_000_000; // USDT 6 decimals
    const tolerance = 0.01;

    if (Math.abs(amount - expectedAmount) > tolerance) {
      return {
        verified: false,
        error: `Wrong amount. Expected ${expectedAmount}, got ${amount}`,
      };
    }

    return {
      verified: true,
      txHash,
      fromAddress: transfer.from,
      amountUsdt: amount,
      blockConfirmations: 12,
    };
  } catch (err) {
    return {
      verified: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ─── Main verify function ──────────────────────────────────────────────────

export async function verifyPayment(
  network: PaymentNetwork,
  txHash: string,
  expectedAmount: number,
  reference?: string
): Promise<VerificationResult> {
  const mode = process.env.PAYMENT_MODE || "mock";

  if (mode === "mock") {
    return mockVerify(reference || txHash);
  }

  const address = getReceivingAddress(network);

  if (network === "TRON") {
    return verifyTRC20(txHash, address, expectedAmount);
  }

  return verifyERC20(txHash, address, expectedAmount);
}

// ─── Payment expiry check ──────────────────────────────────────────────────

export function isPaymentExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

export function formatUSDT(amount: number): string {
  return `${amount.toFixed(2)} USDT`;
}
