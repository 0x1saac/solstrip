import { Connection, ParsedTransactionWithMeta } from "@solana/web3.js";

export async function fetch(
  rpc: string,
  sig: string
): Promise<ParsedTransactionWithMeta> {
  const conn = new Connection(rpc, "confirmed");
  const tx = await conn.getParsedTransaction(sig, {
    maxSupportedTransactionVersion: 0,
  });
  if (!tx) {
    throw new Error(`Transaction not found: ${sig}`);
  }
  return tx;
}
