import type { ParsedTx } from "../types.js";

export function json(tx: ParsedTx): void {
  console.log(JSON.stringify(tx, null, 2));
}
