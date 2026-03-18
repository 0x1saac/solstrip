const PROGRAMS: Record<string, string> = {
  "11111111111111111111111111111111": "System",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb": "Token2022",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL": "ATA",
  "ComputeBudget111111111111111111111111111111": "ComputeBudget",
  "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4": "Jupiter v6",
  "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8": "Raydium AMM",
  "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc": "Orca Whirlpool",
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s": "Metaplex Metadata",
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr": "Memo",
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P": "Pump.fun",
  "CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK": "Raydium CLMM",
  "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo": "Meteora DLMM",
  "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD": "Marinade",
  "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY": "Phoenix",
  "srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX": "OpenBook",
  "DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1": "Orca v1",
  "9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP": "Orca v2",
};

const ACCOUNTS: Record<string, string> = {
  "SysvarRent111111111111111111111111111111111": "Rent",
  "SysvarC1ock11111111111111111111111111111111": "Clock",
  "So11111111111111111111111111111111111111112": "wSOL",
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "USDC",
  "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": "USDT",
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So": "mSOL",
  "7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj": "stSOL",
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263": "BONK",
  "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN": "JUP",
};

export function progLabel(id: string): string {
  return PROGRAMS[id] ?? id;
}

export function acctLabel(pubkey: string): string | null {
  return ACCOUNTS[pubkey] ?? PROGRAMS[pubkey] ?? null;
}

export function mintSymbol(mint: string): string | null {
  return ACCOUNTS[mint] ?? null;
}
