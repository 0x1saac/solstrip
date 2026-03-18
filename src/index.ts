#!/usr/bin/env node
import { Command } from "commander";
import { fetch } from "./decoder/fetch.js";
import { decode } from "./decoder/decode.js";
import { trace } from "./display/trace.js";
import { json } from "./display/json.js";
import chalk from "chalk";

const program = new Command();

program
  .name("solstrip")
  .description("strace for Solana — decode transactions into human-readable traces")
  .version("1.0.0")
  .argument("<signature>", "transaction signature")
  .option("-r, --rpc <url>", "RPC endpoint (env: RPC_URL)", process.env.RPC_URL ?? "https://api.mainnet-beta.solana.com")
  .option("-v, --verbose", "show accounts, raw data hex, full logs")
  .option("-j, --json", "output as JSON")
  .action(run);

async function run(sig: string, opts: { rpc: string; verbose?: boolean; json?: boolean }) {
  try {
    const tx = await fetch(opts.rpc, sig);
    const parsed = decode(tx);
    if (opts.json) {
      json(parsed);
    } else {
      trace(parsed, opts.verbose ?? false);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("not found")) {
      console.error(chalk.red(`Error: Transaction not found: ${sig}`));
    } else if (msg.includes("timeout") || msg.includes("ETIMEDOUT")) {
      console.error(chalk.red(`Error: RPC timeout — check your endpoint`));
    } else if (msg.includes("Invalid param")) {
      console.error(chalk.red(`Error: Invalid signature format: ${sig}`));
    } else {
      console.error(chalk.red(`Error: ${msg}`));
    }
    process.exit(1);
  }
}

program.parse();
