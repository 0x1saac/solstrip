import {
  ParsedTransactionWithMeta,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  ParsedMessageAccount,
} from "@solana/web3.js";
import type { ParsedTx, ParsedIx, AccountMeta, BalanceChange } from "../types.js";
import { progLabel, acctLabel, mintSymbol } from "./labels.js";
import { decodeNative } from "./native.js";
import { hexEncode } from "../utils.js";
import bs58 from "bs58";

export function decode(tx: ParsedTransactionWithMeta): ParsedTx {
  const msg = tx.transaction.message;
  const meta = tx.meta!;

  const sig = tx.transaction.signatures[0];
  const slot = tx.slot;
  const success = meta.err === null;
  const fee = meta.fee;
  const logs = meta.logMessages ?? [];
  const err = meta.err ? JSON.stringify(meta.err) : null;

  const accountKeys: ParsedMessageAccount[] = msg.accountKeys;
  const signers = accountKeys.filter((a) => a.signer).map((a) => a.pubkey.toBase58());

  const instructions: ParsedIx[] = msg.instructions.map((ix, idx) => {
    const base = mapIx(ix, accountKeys);
    const innerIxs = meta.innerInstructions?.find((ii) => ii.index === idx);
    const inner: ParsedIx[] = (innerIxs?.instructions ?? []).map((cpi, ci) => ({
      ...mapIx(cpi, accountKeys),
      index: ci,
      inner: [],
    }));
    return { ...base, index: idx, inner };
  });

  const balanceChanges = buildBalances(accountKeys, meta);

  return { signature: sig, slot, success, err, fee, signers, instructions, balanceChanges, logs };
}

function mapIx(
  ix: ParsedInstruction | PartiallyDecodedInstruction,
  accountKeys: ParsedMessageAccount[]
): Omit<ParsedIx, "index" | "inner"> {
  const programId = ix.programId.toBase58();
  const program = progLabel(programId);

  let decoded: string | null = null;
  let accounts: AccountMeta[] = [];
  let dataHex = "";

  if ("parsed" in ix) {
    const p = ix as ParsedInstruction;
    decoded = fmtParsed(p.parsed);
    if (typeof p.parsed === "object" && p.parsed !== null && "info" in p.parsed) {
      const info = p.parsed.info;
      if (info && typeof info === "object") {
        for (const [, val] of Object.entries(info)) {
          if (typeof val === "string" && val.length >= 32 && val.length <= 44) {
            accounts.push({
              pubkey: val,
              isSigner: false,
              isWritable: false,
              label: acctLabel(val),
            });
          }
        }
      }
    }
  } else {
    const partial = ix as PartiallyDecodedInstruction;
    const raw = partial.data;
    try {
      dataHex = hexEncode(Buffer.from(bs58.decode(raw)));
    } catch {
      dataHex = raw;
    }
    decoded = decodeNative(programId, raw);
    accounts = partial.accounts.map((a) => {
      const key = a.toBase58();
      const info = accountKeys.find((ak) => ak.pubkey.toBase58() === key);
      return {
        pubkey: key,
        isSigner: info?.signer ?? false,
        isWritable: info?.writable ?? false,
        label: acctLabel(key),
      };
    });
  }

  return { program, programId, decoded, accounts, dataHex };
}

function fmtParsed(parsed: unknown): string | null {
  if (typeof parsed === "string") return parsed;
  if (typeof parsed === "object" && parsed !== null) {
    const obj = parsed as Record<string, unknown>;
    const type = obj.type as string | undefined;
    const info = obj.info as Record<string, unknown> | undefined;
    if (type && info) {
      const params = Object.entries(info)
        .filter(([, v]) => typeof v !== "object")
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      return params ? `${type} { ${params} }` : type;
    }
    if (type) return type;
  }
  return null;
}

function buildBalances(
  accountKeys: ParsedMessageAccount[],
  meta: ParsedTransactionWithMeta["meta"] & {}
): BalanceChange[] {
  const changes: Map<string, BalanceChange> = new Map();

  const preBalances = meta.preBalances;
  const postBalances = meta.postBalances;

  for (let i = 0; i < accountKeys.length; i++) {
    const key = accountKeys[i].pubkey.toBase58();
    const solDiff = (postBalances[i] - preBalances[i]) / 1_000_000_000;
    if (Math.abs(solDiff) > 0.000000001) {
      if (!changes.has(key)) {
        changes.set(key, { account: key, label: acctLabel(key), solChange: 0, tokenChanges: [] });
      }
      changes.get(key)!.solChange = solDiff;
    }
  }

  const preTok = meta.preTokenBalances ?? [];
  const postTok = meta.postTokenBalances ?? [];

  const tokMap: Map<string, { pre: number; post: number; mint: string; decimals: number; owner: string }> = new Map();

  for (const tb of preTok) {
    const owner = tb.owner ?? accountKeys[tb.accountIndex].pubkey.toBase58();
    const id = `${owner}:${tb.mint}`;
    const amt = Number(tb.uiTokenAmount.amount);
    tokMap.set(id, { pre: amt, post: 0, mint: tb.mint, decimals: tb.uiTokenAmount.decimals, owner });
  }

  for (const tb of postTok) {
    const owner = tb.owner ?? accountKeys[tb.accountIndex].pubkey.toBase58();
    const id = `${owner}:${tb.mint}`;
    const existing = tokMap.get(id);
    const amt = Number(tb.uiTokenAmount.amount);
    if (existing) {
      existing.post = amt;
    } else {
      tokMap.set(id, { pre: 0, post: amt, mint: tb.mint, decimals: tb.uiTokenAmount.decimals, owner });
    }
  }

  for (const [, val] of tokMap) {
    const diff = val.post - val.pre;
    if (diff === 0) continue;
    const key = val.owner;
    if (!changes.has(key)) {
      changes.set(key, { account: key, label: acctLabel(key), solChange: 0, tokenChanges: [] });
    }
    changes.get(key)!.tokenChanges.push({
      mint: val.mint,
      symbol: mintSymbol(val.mint),
      change: diff,
      decimals: val.decimals,
    });
  }

  return Array.from(changes.values()).filter(
    (c) => Math.abs(c.solChange) > 0.000000001 || c.tokenChanges.length > 0
  );
}
