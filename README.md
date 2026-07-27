# AgentData Pay

AgentData Pay is an autonomous data-purchasing agent built on Arc.

The agent determines which market-intelligence API is required, pays for access using test USDC, receives the protected data and presents the result to the user.

## Track

Agentic Economy

## Initial use case

The initial MVP provides paid access to Whitefield real-estate intelligence:

- Market summary
- New property listings
- Price-reduction opportunities
- Potential underpriced listings

## Planned technology

- Arc Testnet
- USDC
- Circle Agent Stack
- Circle Agent Wallet
- Nanopayments / x402
- FastAPI
- Next.js or a simple HTML frontend
- SQLite or PostgreSQL

## Planned flow

1. User asks the agent a market question.
2. Agent selects the required data endpoint.
3. Paid API requests a test-USDC payment.
4. Agent pays autonomously.
5. API provides the requested data.
6. Agent analyses and returns the result.

## Current status

Project architecture and MVP scope defined. Repository created and Arc payment integration research started.
