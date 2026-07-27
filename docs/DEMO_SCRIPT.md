# Three-minute demo script

## 0:00–0:25 — Problem

Market-intelligence APIs are useful to AI agents, but subscriptions and per-transaction gas fees make small, autonomous purchases impractical.

AgentData Pay lets an agent buy only the dataset needed for a user's current question.

## 0:25–0:55 — Product

Open the application and show:

- Arc Testnet network status
- Payment mode
- The natural-language market question
- The three suggested query types

Explain that each resource costs `$0.001 USDC`.

## 0:55–1:40 — Payment loop

Run:

```text
Show me underpriced property opportunities in Whitefield
```

Walk through the activity panel:

1. The agent interprets the question.
2. It selects the opportunities resource.
3. The API returns HTTP 402.
4. The agent signs the USDC payment authorization.
5. The protected JSON is unlocked.

For the final recording, run with `PAYMENT_MODE=live` and show the Circle Gateway receipt or transaction evidence.

## 1:40–2:20 — Result

Show:

- The unlocked listings
- Price-per-square-foot comparisons
- The agent's strongest review candidate
- The data disclaimer

## 2:20–2:50 — Architecture

Show the repository:

- `src/payments.ts`: seller-side x402 protection
- `src/agent.ts`: autonomous buyer
- `src/intelligence.ts`: dataset selection and analysis
- `tests/app.test.ts`: complete payment-loop tests

## 2:50–3:00 — Close

“AgentData Pay turns paid data into an agent-native primitive: discover, price, pay, unlock, and analyse—in one autonomous loop on Arc.”
