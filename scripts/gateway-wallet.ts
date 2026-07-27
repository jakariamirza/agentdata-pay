import "dotenv/config";
import { GatewayClient } from "@circle-fin/x402-batching/client";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY as `0x${string}` | undefined;

if (!privateKey || !/^0x[a-fA-F0-9]{64}$/.test(privateKey)) {
  throw new Error("A valid PRIVATE_KEY is required in .env.");
}

const account = privateKeyToAccount(privateKey);
const client = new GatewayClient({
  chain: "arcTestnet",
  privateKey,
  rpcUrl:
    process.env.ARC_RPC_URL ??
    "https://rpc.quicknode.testnet.arc.network",
});

async function printBalances() {
  const balances = await client.getBalances();
  console.log(`Buyer address:     ${account.address}`);
  console.log(`Wallet USDC:       ${balances.wallet.formatted}`);
  console.log(
    `Gateway available: ${balances.gateway.formattedAvailable} USDC`,
  );
  console.log(`Gateway total:     ${balances.gateway.formattedTotal} USDC`);
}

async function main() {
  const command = process.argv[2] ?? "status";

  if (command === "status") {
    await printBalances();
    return;
  }

  if (command === "deposit") {
    const amount = process.argv[3] ?? "1";
    if (!/^\d+(\.\d{1,6})?$/.test(amount) || Number(amount) <= 0) {
      throw new Error("Deposit amount must be a positive USDC value.");
    }

    await printBalances();
    console.log(`Depositing ${amount} USDC into Circle Gateway...`);
    const result = await client.deposit(amount);
    console.log(`Deposit transaction: ${result.depositTxHash}`);
    await printBalances();
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Gateway command failed: ${message}`);
  process.exitCode = 1;
});
