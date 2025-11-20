# ip-navigator-cli

[![npm version](https://img.shields.io/npm/v/ip-navigator-cli.svg)](https://www.npmjs.com/package/ip-navigator-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<a 
  href="https://www.buymeacoffee.com/marctysonclebert" 
  target="_blank">
<img 
    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" 
    alt="Buy Me A Coffee" 
    style="height: 60px !important;width: 217px !important;"
    />
</a>

🌐 A powerful command-line interface for IP address operations, powered by [ip-navigator](https://www.npmjs.com/package/ip-navigator).

## Features

✨ **Validation**

- Validate IPv4 addresses, subnet masks, and CIDR notation
- Batch validation of multiple IP addresses
- Clear, informative error messages

🔄 **Conversion**

- Convert between decimal, binary, and integer formats
- Convert between CIDR notation and subnet masks
- View all representations of an IP address at once

📊 **Subnet Operations**

- Calculate network and broadcast addresses
- Get comprehensive subnet information
- Check if an IP belongs to a subnet

🛠️ **IP Operations**

- Classify IPs as public or private
- Get next/previous IP addresses
- Generate IP ranges
- Compare IP addresses numerically

## Installation

### Global Installation (Recommended)

```bash
npm install -g ip-navigator-cli
```

### Local Installation

```bash
npm install ip-navigator-cli
```

### Usage with npx (No Installation)

```bash
npx ip-navigator-cli <command>
```

## Quick Start

```bash
# Validate an IP address
ipnav validate-ip 192.168.1.1

# Get subnet information
ipnav subnet-info 192.168.1.100 255.255.255.0

# Convert IP to binary
ipnav to-binary 192.168.1.1

# Classify IP as public or private
ipnav classify 8.8.8.8

# Generate IP range
ipnav range 192.168.1.1 192.168.1.10
```

## Commands

### Validation Commands

#### `validate-ip <address>` (alias: `vip`)

Validate an IPv4 address.

```bash
ipnav validate-ip 192.168.1.1
# ✅ Valid IP address: 192.168.1.1

ipnav vip 256.1.2.3
# ❌ Invalid IP address: 256.1.2.3
```

#### `validate-mask <mask>` (alias: `vmask`)

Validate a subnet mask.

```bash
ipnav validate-mask 255.255.255.0
# ✅ Valid subnet mask: 255.255.255.0
```

#### `validate-cidr <cidr>` (alias: `vcidr`)

Validate CIDR notation.

```bash
ipnav validate-cidr 192.168.1.0/24
# ✅ Valid CIDR notation: 192.168.1.0/24
```

#### `validate-batch <addresses...>` (alias: `vbatch`)

Validate multiple IP addresses at once.

```bash
ipnav validate-batch 192.168.1.1 10.0.0.1 256.1.1.1 8.8.8.8
# ✅ 192.168.1.1
# ✅ 10.0.0.1
# ❌ 256.1.1.1
# ✅ 8.8.8.8
# 📊 Summary: 3 valid, 1 invalid (4 total)
```

Options:

- `-q, --quiet` - Only show invalid addresses

---

### Conversion Commands

#### `to-binary <address>` (alias: `bin`)

Convert IP address to binary representation.

```bash
ipnav to-binary 192.168.1.1
# IP Address: 192.168.1.1
# Binary:     11000000.10101000.00000001.00000001
```

Options:

- `-s, --spaces` - Use spaces instead of dots as separators

#### `from-binary <binary>` (alias: `fbin`)

Convert binary to IP address.

```bash
ipnav from-binary 11000000.10101000.00000001.00000001
# Binary:     11000000.10101000.00000001.00000001
# IP Address: 192.168.1.1
```

#### `to-integer <address>` (alias: `int`)

Convert IP address to 32-bit integer.

```bash
ipnav to-integer 192.168.1.1
# IP Address: 192.168.1.1
# Integer:    3232235777

ipnav int 192.168.1.1 --hex
# IP Address: 192.168.1.1
# Integer:    3232235777
# Hexadecimal: 0xC0A80101
```

Options:

- `-h, --hex` - Display result in hexadecimal

#### `from-integer <number>` (alias: `fint`)

Convert 32-bit integer to IP address.

```bash
ipnav from-integer 3232235777
# Integer:    3232235777
# IP Address: 192.168.1.1
```

#### `cidr-to-mask <prefix>` (alias: `c2m`)

Convert CIDR prefix to subnet mask.

```bash
ipnav cidr-to-mask 24
# CIDR Prefix:  /24
# Subnet Mask:  255.255.255.0
# Binary:       11111111.11111111.11111111.00000000
```

#### `mask-to-cidr <mask>` (alias: `m2c`)

Convert subnet mask to CIDR prefix.

```bash
ipnav mask-to-cidr 255.255.255.0
# Subnet Mask:  255.255.255.0
# CIDR Prefix:  /24
# Binary:       11111111.11111111.11111111.00000000
```

#### `convert <address>` (alias: `cvt`)

Show all representations of an IP address.

```bash
ipnav convert 192.168.1.1

# 🔢 IP Address Representations:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Decimal:     192.168.1.1
# Binary:      11000000.10101000.00000001.00000001
# Integer:     3232235777
# Hexadecimal: 0xC0A80101
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Subnet Commands

#### `subnet-info <address> [mask]` (alias: `sinfo`)

Get comprehensive subnet information.

```bash
ipnav subnet-info 192.168.1.100 255.255.255.0

# 📊 Subnet Information:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# IP Address:        192.168.1.100
# Subnet Mask:       255.255.255.0
# Network Address:   192.168.1.0
# Broadcast Address: 192.168.1.255
# First Usable:      192.168.1.1
# Last Usable:       192.168.1.254
# Total Hosts:       256
# Usable Hosts:      254
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Using CIDR notation
ipnav sinfo 192.168.1.100 --cidr 24
```

Options:

- `-c, --cidr <prefix>` - Use CIDR notation instead of subnet mask

#### `network-address <address> <mask>` (alias: `netaddr`)

Calculate network address from IP and subnet mask.

```bash
ipnav network-address 192.168.1.100 255.255.255.0
# Network Address: 192.168.1.0
```

#### `broadcast-address <address> <mask>` (alias: `bcast`)

Calculate broadcast address from IP and subnet mask.

```bash
ipnav broadcast-address 192.168.1.100 255.255.255.0
# Broadcast Address: 192.168.1.255
```

#### `in-subnet <address> <network> <mask>` (alias: `insubnet`)

Check if an IP address belongs to a subnet.

```bash
ipnav in-subnet 192.168.1.100 192.168.1.0 255.255.255.0
# ✅ 192.168.1.100 belongs to subnet 192.168.1.0/255.255.255.0

ipnav insubnet 10.0.0.1 192.168.1.0 255.255.255.0
# ❌ 10.0.0.1 does NOT belong to subnet 192.168.1.0/255.255.255.0
```

---

### IP Operations

#### `classify <address>` (alias: `class`)

Classify IP address as public or private.

```bash
ipnav classify 192.168.1.1

# 🔍 IP Classification:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# IP Address: 192.168.1.1
# Type:       🏠 Private IP
# Standard:   RFC 1918 (Private Network)
# Range:      192.168.0.0 - 192.168.255.255
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ipnav class 8.8.8.8
# Type:       🌐 Public IP
```

#### `next <address>`

Get the next IP address in sequence.

```bash
ipnav next 192.168.1.1
# Current: 192.168.1.1
# Next 1:  192.168.1.2

ipnav next 192.168.1.1 --count 5
# Current: 192.168.1.1
# Next 1:  192.168.1.2
# Next 2:  192.168.1.3
# Next 3:  192.168.1.4
# Next 4:  192.168.1.5
# Next 5:  192.168.1.6
```

Options:

- `-n, --count <number>` - Get N next IP addresses (1-100)

#### `previous <address>` (alias: `prev`)

Get the previous IP address in sequence.

```bash
ipnav previous 192.168.1.10
# Prev 1: 192.168.1.9
# Current: 192.168.1.10

ipnav prev 192.168.1.10 --count 3
# Prev 3: 192.168.1.7
# Prev 2: 192.168.1.8
# Prev 1: 192.168.1.9
# Current: 192.168.1.10
```

Options:

- `-n, --count <number>` - Get N previous IP addresses (1-100)

#### `range <start> <end>`

Generate all IP addresses between start and end (inclusive).

```bash
ipnav range 192.168.1.1 192.168.1.5

# 📋 IP Range (5 addresses):
#   1. 192.168.1.1
#   2. 192.168.1.2
#   3. 192.168.1.3
#   4. 192.168.1.4
#   5. 192.168.1.5

ipnav range 192.168.1.1 192.168.1.255 --count

# 📊 IP Range Information:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Start:  192.168.1.1
# End:    192.168.1.255
# Count:  255 addresses
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Options:

- `-c, --count` - Only show the count of IPs in range
- `-l, --limit <number>` - Limit output to specified number of IPs (default: 100)

#### `compare <ip1> <ip2>` (alias: `cmp`)

Compare two IP addresses numerically.

```bash
ipnav compare 192.168.1.1 192.168.1.2

# 🔢 IP Comparison:
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# IP 1:   192.168.1.1
# IP 2:   192.168.1.2
# Result: 192.168.1.1 < 192.168.1.2 (IP 1 is smaller)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Command Reference

| Command             | Alias      | Description                 |
| ------------------- | ---------- | --------------------------- |
| `validate-ip`       | `vip`      | Validate IPv4 address       |
| `validate-mask`     | `vmask`    | Validate subnet mask        |
| `validate-cidr`     | `vcidr`    | Validate CIDR notation      |
| `validate-batch`    | `vbatch`   | Validate multiple IPs       |
| `to-binary`         | `bin`      | Convert IP to binary        |
| `from-binary`       | `fbin`     | Convert binary to IP        |
| `to-integer`        | `int`      | Convert IP to integer       |
| `from-integer`      | `fint`     | Convert integer to IP       |
| `cidr-to-mask`      | `c2m`      | Convert CIDR to subnet mask |
| `mask-to-cidr`      | `m2c`      | Convert subnet mask to CIDR |
| `convert`           | `cvt`      | Show all IP representations |
| `subnet-info`       | `sinfo`    | Get subnet information      |
| `network-address`   | `netaddr`  | Calculate network address   |
| `broadcast-address` | `bcast`    | Calculate broadcast address |
| `in-subnet`         | `insubnet` | Check subnet membership     |
| `classify`          | `class`    | Classify as public/private  |
| `next`              | -          | Get next IP address         |
| `previous`          | `prev`     | Get previous IP address     |
| `range`             | -          | Generate IP range           |
| `compare`           | `cmp`      | Compare two IPs             |

## Common Use Cases

### Network Administration

```bash
# Check if a host is in your network
ipnav in-subnet 192.168.1.50 192.168.1.0 255.255.255.0

# Get available hosts in a subnet
ipnav subnet-info 192.168.1.0 --cidr 24

# Find network and broadcast addresses
ipnav network-address 10.0.50.100 255.255.255.0
ipnav broadcast-address 10.0.50.100 255.255.255.0
```

### Security & Filtering

```bash
# Check if an IP is public (external) or private (internal)
ipnav classify 203.0.113.45

# Validate a list of IPs from a file
cat ip_list.txt | xargs ipnav validate-batch --quiet
```

### Development & Testing

```bash
# Generate test IP addresses
ipnav range 192.168.1.1 192.168.1.10

# Convert IPs for different formats
ipnav convert 172.16.0.1

# Get sequential IPs for testing
ipnav next 10.0.0.1 --count 5
```

### Learning & Documentation

```bash
# Understand subnet calculations
ipnav subnet-info 192.168.1.100 255.255.255.0

# See all representations of an IP
ipnav convert 8.8.8.8

# Convert between CIDR and subnet mask
ipnav cidr-to-mask 24
ipnav mask-to-cidr 255.255.0.0
```

## Exit Codes

- `0` - Success
- `1` - Error (invalid input, validation failure, etc.)

This makes the CLI perfect for use in shell scripts:

```bash
#!/bin/bash
if ipnav validate-ip "$1"; then
    echo "Valid IP, proceeding..."
else
    echo "Invalid IP, aborting!"
    exit 1
fi
```

## Tips & Tricks

### Use Aliases for Speed

```bash
ipnav vip 192.168.1.1      # Instead of validate-ip
ipnav bin 10.0.0.1          # Instead of to-binary
ipnav cvt 172.16.0.1        # Instead of convert
```

### Pipe Operations

```bash
# Validate IPs from a file
cat servers.txt | xargs ipnav validate-batch

# Process multiple conversions
echo "192.168.1.1 10.0.0.1" | xargs -n1 ipnav to-integer
```

### Combine with Other Tools

```bash
# Extract IPs from logs and validate them
grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' access.log | \
  sort -u | \
  xargs ipnav validate-batch
```

## Requirements

- Node.js 14.x or higher

## Dependencies

- [ip-navigator](https://www.npmjs.com/package/ip-navigator) - Core IP address operations
- [commander](https://www.npmjs.com/package/commander) - CLI framework

## Related Projects

- [ip-navigator](https://www.npmjs.com/package/ip-navigator) - The core library powering this CLI

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Marc Tyson CLEBERT <contact@marctysonclebert.com>**

- Website: [marctysonclebert.com](https://www.marctysonclebert.com)
- GitHub: [@clebertmarctyson](https://github.com/clebertmarctyson)
- Twitter/X: [@ClebertTyson](https://x.com/ClebertTyson)
- Buy me a coffee: [Support my work](https://www.buymeacoffee.com/marctysonclebert)

## Support the Project

If `ip-navigator-cli` has been helpful to you, consider:

- ⭐ Starring the repo
- 🐛 Reporting bugs
- 💡 Suggesting features
- ☕ [Buying me a coffee](https://www.buymeacoffee.com/marctysonclebert)

---

Made with ❤️ using [ip-navigator](https://www.npmjs.com/package/ip-navigator)
