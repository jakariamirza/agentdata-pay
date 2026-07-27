import express from "express";
import { config } from "./config.js";
import { runAgent } from "./agent.js";
import {
  getResource,
  resourceCatalog,
  type Resource,
} from "./intelligence.js";
import { createPaymentGate, type PaidRequest } from "./payments.js";

const resources = Object.keys(resourceCatalog) as Resource[];

export function createApp() {
  const app = express();
  const paymentGate = createPaymentGate();

  app.use(express.json());
  app.use(express.static("public"));

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      project: "AgentData Pay",
      paymentMode: config.paymentMode,
      network: "Arc Testnet",
    });
  });

  app.get("/api/catalog", (_req, res) => {
    res.json({
      price: config.price,
      currency: "USDC",
      network: "Arc Testnet",
      resources: resourceCatalog,
    });
  });

  app.get(
    "/api/intelligence/:resource",
    paymentGate,
    (req: PaidRequest, res) => {
      const resource = req.params.resource as Resource;
      if (!resources.includes(resource)) {
        res.status(404).json({ error: "unknown_resource" });
        return;
      }
      res.json({
        resource,
        payment: req.payment,
        data: getResource(resource),
      });
    },
  );

  app.post("/api/agent/run", async (req, res) => {
    const query = String(req.body?.query ?? "").trim();
    if (!query) {
      res.status(400).json({ error: "A market question is required." });
      return;
    }

    try {
      const origin = `${req.protocol}://${req.get("host")}`;
      res.json(await runAgent(query, origin));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown agent error";
      res.status(502).json({
        error: "agent_payment_failed",
        message,
        paymentMode: config.paymentMode,
      });
    }
  });

  return app;
}

export default createApp();
