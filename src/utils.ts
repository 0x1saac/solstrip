export function fmtSol(sol: number): string {
  return sol.toFixed(6);
}

export function short(address: string): string {
  if (address.length <= 11) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function hexEncode(data: Buffer | Uint8Array): string {
  return Buffer.from(data).toString("hex");
}

export function fmtToken(amount: number, decimals: number): string {
  return (amount / Math.pow(10, decimals)).toFixed(decimals);
}
