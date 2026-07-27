import { GatewayClient } from "@circle-fin/x402-batching/client";
import { config, assertLiveConfig } from "./config.js";
import {
  buildInsights,
  chooseResource,
  resourceCatalog,
  type Resource,
} from "./intelligence.js";

type PaidResponse = {
  resource: Resource;
  payment: Record<string, unknown>;
  data: ReturnType<typeof import("./intelligence.js").getResource>;
};

async function payInDemoMode(url: string) {
  const first = await fetch(url);
  if (first.status !== 402) {
    throw new Error(`Expected 402 from paid resource, received ${first.status}.`);
  }
  const requirement = first.headers.get("PAYMENT-REQUIRED");
  if (!requirement) throw new Error("Paid resource omitted PAYMENT-REQUIRED.");

  const paid = await fetch(url, {
    headers: { "PAYMENT-SIGNATURE": config.demoPaymentSignature },
  });
  if (!paid.ok) {
    throw new Error(`Demo payment retry failed with ${paid.status}.`);
  }
  return {
    payload: (await paid.json()) as PaidResponse,
    initialStatus: first.status,
    proof: "demo-eip3009-authorization",
  };
}

async function payLive(url: string) {
  assertLiveConfig();
  const client = new GatewayClient({
    chain: "arcTestnet",
    privateKey: config.privateKey as `0x${string}`,
    rpcUrl: config.arcRpcUrl,
  });
  const result = await client.pay(url);
  if (result.status !== 200) {
    throw new Error(`Gateway payment failed with ${result.status}.`);
  }
  return {
    payload: result.data as PaidResponse,
    initialStatus: 402,
    proof: "Circle Gateway EIP-3009 authorization",
  };
}

export async function runAgent(query: string, origin: string) {
  const resource = chooseResource(query);
  const endpoint = `${origin}/api/intelligence/${resource}`;
  const startedAt = Date.now();
  const result =
    config.paymentMode === "live"
      ? await payLive(endpoint)
      : await payInDemoMode(endpoint);

  return {
    query,
    decision: {
      resource,
      label: resourceCatalog[resource].label,
      reason: `The agent mapped the request to the “${resourceCatalog[resource].label}” paid resource.`,
      endpoint,
    },
    payment: {
      requestedStatus: result.initialStatus,
      amount: config.price,
      currency: "USDC",
      network: "Arc Testnet",
      protocol: "x402 + Circle Gateway Nanopayments",
      mode: config.paymentMode,
      proof: result.proof,
      verified: true,
    },
    result: result.payload.data,
    insights: buildInsights(resource, result.payload.data),
    elapsedMs: Date.now() - startedAt,
    steps: [
      { state: "complete", label: "Interpreted the market question" },
      { state: "complete", label: `Selected ${resourceCatalog[resource].label}` },
      { state: "complete", label: "Received HTTP 402 payment requirement" },
      {
        state: "complete",
        label:
          config.paymentMode === "live"
            ? "Signed and settled test-USDC authorization"
            : "Simulated the test-USDC authorization",
      },
      { state: "complete", label: "Unlocked and analysed protected JSON" },
    ],
  };
}
