# AgentData Pay

AgentData Pay is an autonomous data-purchasing agent built for the **Agentic Economy** track of the Programmable Money Hackathon.

A user asks a Whitefield property question. The agent selects the smallest useful paid dataset, calls an x402-protected API, receives `402 Payment Required`, pays in USDC through Circle Gateway Nanopayments, and analyses the protected response.

**Live demo:** [https://agentdata-pay.vercel.app](https://agentdata-pay.vercel.app)

**Demo video:** [AgentData Pay — 3-minute demo](https://youtu.be/hepbZCKqjck)

**Presentation:** [Final submission deck](submission/AgentData-Pay-Final-Submission.pptx)

## Working MVP

The repository contains:

- An Express/TypeScript paid-data API
- Four Whitefield market-intelligence resources
- HTTP 402 payment negotiation
- Circle Gateway Nanopayments buyer and seller integrations
- Autonomous resource selection and payment retry
- A responsive results interface
- A deterministic demo mode for local judging
- A live Arc Testnet mode for real test-USDC payments
- End-to-end tests for the complete payment loop

## Flow

```text
User asks a market question
        ↓
Agent selects a paid resource
        ↓
API returns HTTP 402 + PAYMENT-REQUIRED
        ↓
Agent authorizes $0.001 USDC
        ↓
API verifies the payment
        ↓
Protected JSON is released
        ↓
Agent analyses and presents the result
```

## Run locally

Requirements:

- Node.js 22 or newer
- npm

```bash
npm install
cp .env.example .env
npm start
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
npm start
```

Open [http://localhost:3000](http://localhost:3000).

The default `PAYMENT_MODE=demo` executes the complete HTTP 402 negotiation locally and labels the payment as a simulation. It does not pretend that test USDC moved.

## Enable real Arc Testnet nanopayments

1. Create or choose two Arc Testnet EOA wallets:
   - Buyer: signs payment authorizations.
   - Seller: receives USDC.
2. Obtain testnet USDC from the Circle faucet.
3. Deposit buyer USDC into its Circle Gateway balance.
4. Set:

```dotenv
PAYMENT_MODE=live
SELLER_ADDRESS=0xYOUR_SELLER_EOA
PRIVATE_KEY=0xYOUR_BUYER_EOA_PRIVATE_KEY
FACILITATOR_URL=https://gateway-api-testnet.circle.com
ARC_RPC_URL=https://rpc.quicknode.testnet.arc.network
```

5. Restart the app and run a query.

For an isolated testnet setup, the project can create both wallets locally
without printing either private key:

```bash
npm run wallet:create
npm run gateway:status
npm run gateway:deposit -- 1
```

The generated credentials are stored only in the git-ignored `.env` file.

In live mode:

- The seller route uses `createGatewayMiddleware`.
- The buyer uses `GatewayClient({ chain: "arcTestnet" })`.
- The buyer automatically receives the 402 requirement, signs an EIP-3009 authorization, and retries with `PAYMENT-SIGNATURE`.
- Circle Gateway verifies and settles the nanopayment.

Never commit `.env` or a private key.

## API

### Free endpoints

```text
GET /api/health
GET /api/catalog
POST /api/agent/run
```

Example agent request:

```bash
curl -X POST http://localhost:3000/api/agent/run \
  -H "content-type: application/json" \
  -d "{\"query\":\"Find underpriced opportunities in Whitefield\"}"
```

### Paid resources

```text
GET /api/intelligence/market-summary
GET /api/intelligence/new-listings
GET /api/intelligence/price-reductions
GET /api/intelligence/opportunities
```

An unpaid request returns:

```text
HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: <base64 x402 requirements>
```

## Tests

```bash
npm run build
npm test
```

The test suite verifies:

1. Arc Testnet configuration is exposed.
2. An unpaid request receives HTTP 402.
3. A payment signature unlocks protected JSON.
4. The agent selects, pays for, and analyses a resource autonomously.

## Project structure

```text
src/
  agent.ts          Autonomous buyer and orchestration
  app.ts            Express application and API routes
  config.ts         Demo/live configuration
  data.ts           Curated Whitefield demonstration dataset
  intelligence.ts   Resource selection and analysis
  payments.ts       x402 and Circle Gateway seller gate
  server.ts         Application entry point
public/
  index.html        Results interface
  styles.css
  app.js
tests/
  app.test.ts       End-to-end payment tests
```

## Technology

- Arc Testnet
- USDC
- Circle Gateway Nanopayments
- x402
- `@circle-fin/x402-batching`
- Express
- TypeScript
- HTML, CSS, and browser JavaScript

## Data disclaimer

The included Whitefield listings are a curated hackathon demonstration dataset, not a live property feed. Listing details must be verified before making financial or property decisions.

## Official references

- [Circle Nanopayments](https://developers.circle.com/gateway/nanopayments)
- [Nanopayments buyer quickstart](https://developers.circle.com/gateway/nanopayments/quickstarts/buyer)
- [Nanopayments seller quickstart](https://developers.circle.com/gateway/nanopayments/quickstarts/seller)
- [Arc documentation](https://docs.arc.io)
