import { existsSync, writeFileSync } from "node:fs";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const envPath = new URL("../.env", import.meta.url);

if (existsSync(envPath)) {
  throw new Error(
    ".env already exists. Refusing to overwrite wallet credentials.",
  );
}

const buyerPrivateKey = generatePrivateKey();
const sellerPrivateKey = generatePrivateKey();
const buyer = privateKeyToAccount(buyerPrivateKey);
const seller = privateKeyToAccount(sellerPrivateKey);

const env = `# Local Arc Testnet credentials. Never commit or share this file.
PAYMENT_MODE=live
PORT=3000
BASE_URL=http://localhost:3000

PRIVATE_KEY=${buyerPrivateKey}
BUYER_ADDRESS=${buyer.address}

SELLER_ADDRESS=${seller.address}
SELLER_PRIVATE_KEY=${sellerPrivateKey}

FACILITATOR_URL=https://gateway-api-testnet.circle.com
ARC_RPC_URL=https://rpc.quicknode.testnet.arc.network
`;

writeFileSync(envPath, env, { encoding: "utf8", mode: 0o600, flag: "wx" });

console.log("Created local Arc Testnet wallets.");
console.log(`Buyer address:  ${buyer.address}`);
console.log(`Seller address: ${seller.address}`);
console.log("Private keys were saved only to the ignored local .env file.");
