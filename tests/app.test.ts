import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";

let server: Server;
let origin: string;

before(async () => {
  process.env.PAYMENT_MODE = "demo";
  const { createApp } = await import("../src/app.js");
  const app = createApp();
  await new Promise<void>((resolve) => {
    server = app.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Test server did not expose a TCP port.");
  }
  origin = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

test("health endpoint identifies demo mode and Arc Testnet", async () => {
  const response = await fetch(`${origin}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.paymentMode, "demo");
  assert.equal(body.network, "Arc Testnet");
});

test("unpaid intelligence request returns an x402 payment requirement", async () => {
  const response = await fetch(`${origin}/api/intelligence/opportunities`);
  assert.equal(response.status, 402);
  assert.ok(response.headers.get("PAYMENT-REQUIRED"));
  const body = await response.json();
  assert.equal(body.error, "payment_required");
});

test("demo payment unlocks protected intelligence", async () => {
  const response = await fetch(`${origin}/api/intelligence/opportunities`, {
    headers: { "PAYMENT-SIGNATURE": "agentdata-demo-payment" },
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.payment.verified, true);
  assert.ok(body.data.listings.length > 0);
});

test("agent autonomously handles 402 and returns analysed data", async () => {
  const response = await fetch(`${origin}/api/agent/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: "Find underpriced opportunities in Whitefield",
    }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.decision.resource, "opportunities");
  assert.equal(body.payment.requestedStatus, 402);
  assert.equal(body.payment.verified, true);
  assert.equal(body.steps.length, 5);
});
