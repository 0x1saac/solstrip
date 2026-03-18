import chalk from "chalk";
import type { ParsedTx, ParsedIx } from "../types.js";
import { short, fmtSol, fmtToken } from "../utils.js";

export function trace(tx: ParsedTx, verbose: boolean): void {
  console.log();
  console.log(chalk.gray("TX ") + chalk.yellow(tx.signature));
  console.log(chalk.gray("Slot ") + chalk.white(tx.slot));
  console.log(
    chalk.gray("Status ") +
      (tx.success ? chalk.green("✓ SUCCESS") : chalk.red("✗ FAILED"))
  );  if (tx.err) {
    console.log(chalk.gray("Error ") + chalk.red(tx.err));
  }  console.log(chalk.gray("Fee ") + chalk.white(`${fmtSol(tx.fee / 1_000_000_000)} SOL`));

  console.log();
  console.log(chalk.gray("Signers"));
  for (const s of tx.signers) {
    console.log(`  ${chalk.cyan(s)}`);
  }

  console.log();
  console.log(chalk.gray("Instructions"));
  for (const ix of tx.instructions) {
    printIx(ix, "  ", verbose);
  }

  if (tx.balanceChanges.length > 0) {
    console.log();
    console.log(chalk.gray("Balance Changes"));
    for (const bc of tx.balanceChanges) {
      const label = bc.label ?? short(bc.account);
      const parts: string[] = [];
      if (Math.abs(bc.solChange) > 0.000000001) {
        const sign = bc.solChange > 0 ? "+" : "";
        const color = bc.solChange > 0 ? chalk.green : chalk.red;
        parts.push(color(`${sign}${fmtSol(bc.solChange)} SOL`));
      }
      for (const tc of bc.tokenChanges) {
        const sym = tc.symbol ?? short(tc.mint);
        const sign = tc.change > 0 ? "+" : "";
        const color = tc.change > 0 ? chalk.green : chalk.red;
        parts.push(color(`${sign}${fmtToken(tc.change, tc.decimals)} ${sym}`));
      }
      console.log(`  ${chalk.cyan(label)}  ${parts.join("  ")}`);
    }
  }

  if (verbose && tx.logs.length > 0) {
    console.log();
    console.log(chalk.gray("Logs"));
    for (const log of tx.logs) {
      console.log(chalk.dim(`  ${log}`));
    }
  }

  console.log();
}

function printIx(ix: ParsedIx, indent: string, verbose: boolean): void {
  const label = chalk.blue.bold(`[${ix.program}]`);
  const decoded = ix.decoded ? chalk.white.bold(ix.decoded) : chalk.dim("??? (no IDL)");
  console.log(`${indent}${label} ${decoded}`);

  if (verbose) {
    for (const acc of ix.accounts) {
      const flags = [
        acc.isSigner ? chalk.yellow("[signer]") : "",
        acc.isWritable ? chalk.magenta("[writable]") : "",
      ]
        .filter(Boolean)
        .join(" ");
      const lbl = acc.label ? chalk.gray(` (${acc.label})`) : "";
      console.log(`${indent}  ${chalk.dim(acc.pubkey)}${lbl} ${flags}`);
    }
    if (ix.dataHex) {
      const preview = ix.dataHex.slice(0, 64);
      console.log(`${indent}  ${chalk.dim("data: " + preview + (ix.dataHex.length > 64 ? "..." : ""))}`);
    }
  }

  for (const child of ix.inner) {
    const childLabel = chalk.blue.bold(`[${child.program}]`);
    const childDecoded = child.decoded ? chalk.white.bold(child.decoded) : chalk.dim("???");
    console.log(`${indent}└─ ${childLabel} ${childDecoded}`);

    if (verbose) {
      for (const acc of child.accounts) {
        const flags = [
          acc.isSigner ? chalk.yellow("[signer]") : "",
          acc.isWritable ? chalk.magenta("[writable]") : "",
        ]
          .filter(Boolean)
          .join(" ");
        const lbl = acc.label ? chalk.gray(` (${acc.label})`) : "";
        console.log(`${indent}   ${chalk.dim(acc.pubkey)}${lbl} ${flags}`);
      }
      if (child.dataHex) {
        const preview = child.dataHex.slice(0, 64);
        console.log(`${indent}   ${chalk.dim("data: " + preview + (child.dataHex.length > 64 ? "..." : ""))}`);
      }
    }
  }
}
