export interface ParsedTx {
  signature: string;
  slot: number;
  success: boolean;
  err: string | null;
  fee: number;
  signers: string[];
  instructions: ParsedIx[];
  balanceChanges: BalanceChange[];
  logs: string[];
}

export interface ParsedIx {
  index: number;
  program: string;
  programId: string;
  decoded: string | null;
  accounts: AccountMeta[];
  dataHex: string;
  inner: ParsedIx[];
}

export interface AccountMeta {
  pubkey: string;
  isSigner: boolean;
  isWritable: boolean;
  label: string | null;
}

export interface BalanceChange {
  account: string;
  label: string | null;
  solChange: number;
  tokenChanges: TokenChange[];
}

export interface TokenChange {
  mint: string;
  symbol: string | null;
  change: number;
  decimals: number;
}
