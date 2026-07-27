import type { NextFunction, Request, Response } from "express";
import { createGatewayMiddleware } from "@circle-fin/x402-batching/server";
import { config, assertLiveConfig } from "./config.js";

export type PaidRequest = Request & {
  payment?: {
    verified: boolean;
    payer: string;
    amount: string;
    network: string;
    transaction?: string;
    mode?: "demo" | "live";
  };
};

const ARC_TESTNET_NETWORK = "eip155:5042002";
const ARC_TESTNET_USDC = "0x3600000000000000000000000000000000000000";
const GATEWAY_WALLET = "0x0077777d7EBA4688BDeF3E311b846F25870A19B9";

function paymentRequiredHeader(resourceUrl: string): string {
  const payload = {
    x402Version: 2,
    resource: {
      url: resourceUrl,
      description: "Paid Whitefield real-estate intelligence",
      mimeType: "application/json",
    },
    accepts: [
      {
        scheme: "exact",
        network: ARC_TESTNET_NETWORK,
        asset: ARC_TESTNET_USDC,
        amount: config.priceAtomic,
        maxTimeoutSeconds: 604900,
        payTo: config.sellerAddress,
        extra: {
          name: "GatewayWalletBatched",
          version: "1",
          verifyingContract: GATEWAY_WALLET,
        },
      },
    ],
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function demoPaymentGate(req: PaidRequest, res: Response, next: NextFunction) {
  const signature = req.header("PAYMENT-SIGNATURE");
  if (signature !== config.demoPaymentSignature) {
    res
      .status(402)
      .set("PAYMENT-REQUIRED", paymentRequiredHeader(req.originalUrl))
      .json({
        error: "payment_required",
        message: `${config.price} USDC is required to unlock this resource.`,
        mode: "demo",
        network: "Arc Testnet",
      });
    return;
  }

  req.payment = {
    verified: true,
    payer: "0xAgentDataDemoBuyer",
    amount: config.priceAtomic,
    network: ARC_TESTNET_NETWORK,
    transaction: "demo-eip3009-authorization",
    mode: "demo",
  };
  next();
}

export function createPaymentGate() {
  if (config.paymentMode === "demo") return demoPaymentGate;

  assertLiveConfig();
  const gateway = createGatewayMiddleware({
    sellerAddress: config.sellerAddress,
    networks: [ARC_TESTNET_NETWORK],
    facilitatorUrl: config.facilitatorUrl,
    description: "Paid Whitefield real-estate intelligence",
  });
  return gateway.require(config.price);
}
