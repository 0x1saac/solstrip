# solstrip

`strace` for Solana — decode transactions into human-readable traces.

## Install

```bash
npm i -g solstrip
```

## Usage

```bash
solstrip <TX_SIGNATURE> [options]
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-r, --rpc <url>` | RPC endpoint | `$RPC_URL` or mainnet-beta |
| `-v, --verbose` | Show accounts, raw data hex, full logs | off |
| `-j, --json` | Output as JSON | off |
| `-h, --help` | Show help | |

### Examples

```bash
# Basic trace
solstrip 5K8y...3xQm

# Custom RPC
solstrip 5K8y...3xQm -r https://my-rpc.example.com

# Or set via env
export RPC_URL=https://my-rpc.example.com
solstrip 5K8y...3xQm

# Verbose output
solstrip 5K8y...3xQm -v

# JSON output
solstrip 5K8y...3xQm -j
```

## Supported Programs

| Program | ID |
|---------|----|
| System | `11111111111111111111111111111111` |
| Token | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Token2022 | `TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb` |
| ATA | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| ComputeBudget | `ComputeBudget111111111111111111111111111111` |
| Jupiter v6 | `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4` |
| Raydium AMM | `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8` |
| Orca Whirlpool | `whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc` |
| Metaplex Metadata | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| Memo | `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr` |
| Pump.fun | `6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P` |
| Raydium CLMM | `CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK` |
| Meteora DLMM | `LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo` |
| Marinade | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` |
| Phoenix | `PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY` |
| OpenBook | `srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX` |

## Roadmap

- [ ] Anchor IDL decode
- [ ] Token decimal formatting with registry
- [ ] Address book config (~/.solstrip/labels.json)
- [ ] `--watch` mode for live transaction monitoring
- [ ] Simulation mode (decode without submitting)
- [ ] Multi-sig detection and display

## Contributing

```bash
git clone https://github.com/solstrip/solstrip
cd solstrip
pnpm install
pnpm dev <TX_SIG>
```

## License

MIT
