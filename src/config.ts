import "dotenv/config";

export type PaymentMode = "demo" | "live";

function paymentMode(value: string | undefined): PaymentMode {
  return value?.toLowerCase() === "live" ? "live" : "demo";
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  baseUrl: process.env.BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`,
  paymentMode: paymentMode(process.env.PAYMENT_MODE),
  sellerAddress:
    process.env.SELLER_ADDRESS ??
    "0x0000000000000000000000000000000000000000",
  privateKey: process.env.PRIVATE_KEY,
  facilitatorUrl:
    process.env.FACILITATOR_URL ??
    "https://gateway-api-testnet.circle.com",
  price: "$0.001",
  priceAtomic: "1000",
  demoPaymentSignature: "agentdata-demo-payment",
} as const;

export function assertLiveConfig(): void {
  if (
    !/^0x[a-fA-F0-9]{40}$/.test(config.sellerAddress) ||
    /^0x0{40}$/.test(config.sellerAddress)
  ) {
    throw new Error(
      "PAYMENT_MODE=live requires SELLER_ADDRESS to be a non-zero EVM address.",
    );
  }

  if (!config.privateKey || !/^0x[a-fA-F0-9]{64}$/.test(config.privateKey)) {
    throw new Error(
      "PAYMENT_MODE=live requires PRIVATE_KEY to be a 32-byte hex EOA private key.",
    );
  }
}
