import bs58 from "bs58";

export function decodeNative(programId: string, data: string): string | null {
  let buf: Buffer;
  try {
    buf = Buffer.from(bs58.decode(data));
  } catch {
    return null;
  }

  if (buf.length === 0) return null;

  switch (programId) {
    case "11111111111111111111111111111111":
      return decodeSystem(buf);
    case "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA":
    case "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb":
      return decodeToken(buf);
    case "ComputeBudget111111111111111111111111111111":
      return decodeCB(buf);
    default:
      return null;
  }
}

function decodeSystem(buf: Buffer): string | null {
  if (buf.length < 4) return null;
  const disc = buf.readUInt32LE(0);
  switch (disc) {
    case 0: {
      if (buf.length < 20) return `CreateAccount`;
      const lamports = Number(buf.readBigUInt64LE(4));
      const space = Number(buf.readBigUInt64LE(12));
      return `CreateAccount { lamports: ${lamports}, space: ${space} }`;
    }
    case 2: {
      if (buf.length < 12) return `Transfer`;
      const lamports = Number(buf.readBigUInt64LE(4));
      return `Transfer { lamports: ${lamports} }`;
    }
    case 3:
      return `CreateAccountWithSeed`;
    default:
      return null;
  }
}

function decodeToken(buf: Buffer): string | null {
  const disc = buf[0];
  switch (disc) {
    case 0:
      return `InitializeMint`;
    case 1:
      return `InitializeAccount`;
    case 3: {
      if (buf.length < 9) return `Transfer`;
      const amount = Number(buf.readBigUInt64LE(1));
      return `Transfer { amount: ${amount} }`;
    }
    case 4: {
      if (buf.length < 9) return `Approve`;
      const amount = Number(buf.readBigUInt64LE(1));
      return `Approve { amount: ${amount} }`;
    }
    case 7: {
      if (buf.length < 9) return `MintTo`;
      const amount = Number(buf.readBigUInt64LE(1));
      return `MintTo { amount: ${amount} }`;
    }
    case 8: {
      if (buf.length < 9) return `Burn`;
      const amount = Number(buf.readBigUInt64LE(1));
      return `Burn { amount: ${amount} }`;
    }
    case 9:
      return `CloseAccount`;
    case 12: {
      if (buf.length < 10) return `TransferChecked`;
      const amount = Number(buf.readBigUInt64LE(1));
      const decimals = buf[9];
      return `TransferChecked { amount: ${amount}, decimals: ${decimals} }`;
    }
    default:
      return null;
  }
}

function decodeCB(buf: Buffer): string | null {
  const disc = buf[0];
  switch (disc) {
    case 2: {
      if (buf.length < 5) return `SetComputeUnitLimit`;
      const limit = buf.readUInt32LE(1);
      return `SetComputeUnitLimit { limit: ${limit} }`;
    }
    case 3: {
      if (buf.length < 9) return `SetComputeUnitPrice`;
      const microlamports = Number(buf.readBigUInt64LE(1));
      return `SetComputeUnitPrice { microlamports: ${microlamports} }`;
    }
    default:
      return null;
  }
}
