# ip-navigator-cli

[![npm version](https://img.shields.io/npm/v/ip-navigator-cli.svg)](https://www.npmjs.com/package/ip-navigator-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Buying me a coffee](https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png)](https://www.buymeacoffee.com/marctysonclebert)

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

🤖 **Automation & Scripting**

- Plain text output mode (`--plain`) for all commands
- Perfect for piping to security tools (nmap, masscan, etc.)
- Script-friendly exit codes and parseable output
- Integration with network automation workflows

## Installation

### Global Installation (Recommended)

```bash
npm install -g ip-navigator-cli
```

````

### Local Installation

```bash
npm install ip-navigator-cli
```

### Usage with npx (No Installation)

```bash
npx ip-navigator-cli <command>
```

## Shell Integration

### Oh My Zsh Plugin

Boost your productivity with convenient aliases and completions:

```bash
git clone https://github.com/clebertmarctyson/oh-my-zsh-ipnav \
  ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/ipnav
```

Add `ipnav` to your plugins in `~/.zshrc`:

```bash
plugins=(
  # ... other plugins
  ipnav
)
```

**Available shortcuts:**

- `ipv` → `ipnav validate-ip`
- `ipbin` → `ipnav to-binary`
- `ipclass` → `ipnav classify`
- And many more...

[View full documentation for oh-my-zsh →](https://github.com/clebertmarctyson/oh-my-zsh-ipnav)

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

# Plain output for automation (NEW!)
ipnav range 192.168.1.1 192.168.1.10 --plain | nmap -iL -
```

## Automation & Scripting

All commands support the `--plain` flag for clean, parseable output perfect for piping to other tools or using in scripts.

### Security & Network Scanning

```bash
# Pipe IP range directly to nmap
ipnav range 192.168.1.1 192.168.1.254 --plain | nmap -iL -

# Scan with masscan
ipnav range 10.0.0.1 10.0.0.100 --plain | masscan -p80,443,8080 -iL -

# Get next IPs for sequential scanning
ipnav next 192.168.1.1 -n 50 --plain | nmap -sV -iL -

# Generate targets from subnet info
FIRST=$(ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f3)
LAST=$(ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f4)
ipnav range $FIRST $LAST --plain > scan_targets.txt
```

### Validation in Scripts

```bash
# Validate IP in bash script
if [ "$(ipnav vip 192.168.1.1 --plain)" = "valid" ]; then
  echo "IP is valid"
fi

# Check if IP is private
if [ "$(ipnav classify 192.168.1.1 --plain)" = "private" ]; then
  echo "Internal IP detected"
fi

# Validate subnet membership
if [ "$(ipnav insubnet 192.168.1.50 192.168.1.0 255.255.255.0 --plain)" = "true" ]; then
  echo "IP is in subnet"
fi
```

### Batch Processing

```bash
# Filter only valid IPs from a list
cat ip_list.txt | while read ip; do
  [ "$(ipnav vip "$ip" --plain)" = "valid" ] && echo "$ip"
done > valid_ips.txt

# Convert multiple IPs to integers
for ip in $(cat ips.txt); do
  echo "$ip -> $(ipnav int "$ip" --plain)"
done

# Get network addresses for multiple subnets
cat subnets.txt | while read ip mask; do
  ipnav netaddr "$ip" "$mask" --plain
done
```

### Data Extraction & Parsing

```bash
# Extract specific subnet info (tab-separated output)
ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f1  # Network address
ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f2  # Broadcast address
ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f6  # Usable hosts

# Get all IP representations (tab-separated)
ipnav convert 192.168.1.1 --plain | awk '{print "Binary: "$2", Integer: "$3}'

# Extract only valid IPs from batch validation
ipnav vbatch 192.168.1.1 10.0.0.1 256.1.1.1 --plain
# Output: Only valid IPs, one per line
```

### Network Automation Workflows

```bash
# Scan all private IPs from a mixed list
for ip in $(cat all_ips.txt); do
  if [ "$(ipnav classify $ip --plain)" = "private" ]; then
    ipnav vip "$ip" --plain | grep -q "valid" && echo "$ip" >> private_targets.txt
  fi
done

# Generate DHCP range
INFO=$(ipnav sinfo 192.168.1.1 255.255.255.0 --plain)
FIRST=$(echo $INFO | cut -f3)
LAST=$(echo $INFO | cut -f4)
echo "DHCP Range: $FIRST - $LAST"

# Compare and sort IPs
ipnav compare 192.168.1.10 192.168.1.20 --plain  # Output: -1, 0, or 1
```

### Plain Output Formats

| Command          | Plain Output Format                                        |
| ---------------- | ---------------------------------------------------------- |
| `validate-ip`    | `valid` or `invalid`                                       |
| `validate-batch` | One valid IP per line                                      |
| `classify`       | `public` or `private`                                      |
| `compare`        | `-1` (less), `0` (equal), or `1` (greater)                 |
| `in-subnet`      | `true` or `false`                                          |
| `range`          | One IP per line                                            |
| `next/previous`  | One IP per line                                            |
| `to-binary`      | Binary representation only                                 |
| `to-integer`     | Integer only (or hex with `--hex`)                         |
| `convert`        | Tab-separated: `decimal binary integer hex`                |
| `subnet-info`    | Tab-separated: `network broadcast first last total usable` |
| `network-addr`   | Network address only                                       |
| `broadcast-addr` | Broadcast address only                                     |

## Commands

### Validation Commands

#### `validate-ip <address>` (alias: `vip`)

Validate an IPv4 address.

```bash
ipnav validate-ip 192.168.1.1
# ✅ Valid IP address: 192.168.1.1

ipnav vip 256.1.2.3
# ❌ Invalid IP address: 256.1.2.3

# Plain output for scripts
ipnav vip 192.168.1.1 --plain
# valid
```

**Options:**

- `-p, --plain` - Output only `valid` or `invalid`

#### `validate-mask <mask>` (alias: `vmask`)

Validate a subnet mask.

```bash
ipnav validate-mask 255.255.255.0
# ✅ Valid subnet mask: 255.255.255.0

# Plain output
ipnav vmask 255.255.255.0 --plain
# valid
```

**Options:**

- `-p, --plain` - Output only `valid` or `invalid`

#### `validate-cidr <cidr>` (alias: `vcidr`)

Validate CIDR notation.

```bash
ipnav validate-cidr 192.168.1.0/24
# ✅ Valid CIDR notation: 192.168.1.0/24

# Plain output
ipnav vcidr 192.168.1.0/24 --plain
# valid
```

**Options:**

- `-p, --plain` - Output only `valid` or `invalid`

#### `validate-batch <addresses...>` (alias: `vbatch`)

Validate multiple IP addresses at once.

```bash
ipnav validate-batch 192.168.1.1 10.0.0.1 256.1.1.1 8.8.8.8
# ✅ 192.168.1.1
# ✅ 10.0.0.1
# ❌ 256.1.1.1
# ✅ 8.8.8.8
# 📊 Summary: 3 valid, 1 invalid (4 total)

# Plain output - only valid IPs
ipnav vbatch 192.168.1.1 10.0.0.1 256.1.1.1 --plain
# 192.168.1.1
# 10.0.0.1
```

**Options:**

- `-q, --quiet` - Only show invalid addresses
- `-p, --plain` - Output only valid IP addresses (one per line)

---

### Conversion Commands

#### `to-binary <address>` (alias: `bin`)

Convert IP address to binary representation.

```bash
ipnav to-binary 192.168.1.1
# IP Address: 192.168.1.1
# Binary:     11000000.10101000.00000001.00000001

# Plain output
ipnav bin 192.168.1.1 --plain
# 11000000.10101000.00000001.00000001
```

**Options:**

- `-s, --spaces` - Use spaces instead of dots as separators
- `-p, --plain` - Output only the binary value

#### `from-binary <binary>` (alias: `fbin`)

Convert binary to IP address.

```bash
ipnav from-binary 11000000.10101000.00000001.00000001
# Binary:     11000000.10101000.00000001.00000001
# IP Address: 192.168.1.1

# Plain output
ipnav fbin 11000000.10101000.00000001.00000001 --plain
# 192.168.1.1
```

**Options:**

- `-p, --plain` - Output only the IP address

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

# Plain output
ipnav int 192.168.1.1 --plain
# 3232235777

ipnav int 192.168.1.1 --hex --plain
# 0xC0A80101
```

**Options:**

- `-h, --hex` - Display result in hexadecimal
- `-p, --plain` - Output only the integer value

#### `from-integer <number>` (alias: `fint`)

Convert 32-bit integer to IP address.

```bash
ipnav from-integer 3232235777
# Integer:    3232235777
# IP Address: 192.168.1.1

# Plain output
ipnav fint 3232235777 --plain
# 192.168.1.1
```

**Options:**

- `-p, --plain` - Output only the IP address

#### `cidr-to-mask <prefix>` (alias: `c2m`)

Convert CIDR prefix to subnet mask.

```bash
ipnav cidr-to-mask 24
# CIDR Prefix:  /24
# Subnet Mask:  255.255.255.0
# Binary:       11111111.11111111.11111111.00000000

# Plain output
ipnav c2m 24 --plain
# 255.255.255.0
```

**Options:**

- `-p, --plain` - Output only the subnet mask

#### `mask-to-cidr <mask>` (alias: `m2c`)

Convert subnet mask to CIDR prefix.

```bash
ipnav mask-to-cidr 255.255.255.0
# Subnet Mask:  255.255.255.0
# CIDR Prefix:  /24
# Binary:       11111111.11111111.11111111.00000000

# Plain output
ipnav m2c 255.255.255.0 --plain
# 24
```

**Options:**

- `-p, --plain` - Output only the CIDR prefix (without /)

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

# Plain output (tab-separated)
ipnav cvt 192.168.1.1 --plain
# 192.168.1.1	11000000.10101000.00000001.00000001	3232235777	0xC0A80101
```

**Options:**

- `-p, --plain` - Output tab-separated values: `decimal binary integer hex`

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

# Plain output (tab-separated)
ipnav sinfo 192.168.1.100 255.255.255.0 --plain
# 192.168.1.0	192.168.1.255	192.168.1.1	192.168.1.254	256	254
```

**Options:**

- `-c, --cidr <prefix>` - Use CIDR notation instead of subnet mask
- `-p, --plain` - Output tab-separated values: `network broadcast firstUsable lastUsable totalHosts usableHosts`

#### `network-address <address> <mask>` (alias: `netaddr`)

Calculate network address from IP and subnet mask.

```bash
ipnav network-address 192.168.1.100 255.255.255.0
# Network Address: 192.168.1.0

# Plain output
ipnav netaddr 192.168.1.100 255.255.255.0 --plain
# 192.168.1.0
```

**Options:**

- `-p, --plain` - Output only the network address

#### `broadcast-address <address> <mask>` (alias: `bcast`)

Calculate broadcast address from IP and subnet mask.

```bash
ipnav broadcast-address 192.168.1.100 255.255.255.0
# Broadcast Address: 192.168.1.255

# Plain output
ipnav bcast 192.168.1.100 255.255.255.0 --plain
# 192.168.1.255
```

**Options:**

- `-p, --plain` - Output only the broadcast address

#### `in-subnet <address> <network> <mask>` (alias: `insubnet`)

Check if an IP address belongs to a subnet.

```bash
ipnav in-subnet 192.168.1.100 192.168.1.0 255.255.255.0
# ✅ 192.168.1.100 belongs to subnet 192.168.1.0/255.255.255.0

ipnav insubnet 10.0.0.1 192.168.1.0 255.255.255.0
# ❌ 10.0.0.1 does NOT belong to subnet 192.168.1.0/255.255.255.0

# Plain output
ipnav insubnet 192.168.1.100 192.168.1.0 255.255.255.0 --plain
# true
```

**Options:**

- `-p, --plain` - Output only `true` or `false`

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

# Plain output
ipnav class 192.168.1.1 --plain
# private

ipnav class 8.8.8.8 --plain
# public
```

**Options:**

- `-p, --plain` - Output only `public` or `private`

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

# Plain output
ipnav next 192.168.1.1 -n 3 --plain
# 192.168.1.2
# 192.168.1.3
# 192.168.1.4
```

**Options:**

- `-n, --count <number>` - Get N next IP addresses (1-100)
- `-p, --plain` - Output plain IP list (one per line)

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

# Plain output
ipnav prev 192.168.1.10 -n 3 --plain
# 192.168.1.9
# 192.168.1.8
# 192.168.1.7
```

**Options:**

- `-n, --count <number>` - Get N previous IP addresses (1-100)
- `-p, --plain` - Output plain IP list (one per line)

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

# Plain output - perfect for piping to nmap
ipnav range 192.168.1.1 192.168.1.5 --plain
# 192.168.1.1
# 192.168.1.2
# 192.168.1.3
# 192.168.1.4
# 192.168.1.5

# Pipe directly to nmap
ipnav range 192.168.1.1 192.168.1.254 --plain | nmap -iL -
```

**Options:**

- `-c, --count` - Only show the count of IPs in range
- `-l, --limit <number>` - Limit output to specified number of IPs (default: 100)
- `-p, --plain` - Output plain IP list (one per line, no formatting)

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

# Plain output
ipnav cmp 192.168.1.1 192.168.1.2 --plain
# -1  (IP1 < IP2)

ipnav cmp 192.168.1.1 192.168.1.1 --plain
# 0   (IP1 = IP2)

ipnav cmp 192.168.1.2 192.168.1.1 --plain
# 1   (IP1 > IP2)
```

**Options:**

- `-p, --plain` - Output plain format: `-1` (less), `0` (equal), `1` (greater)

---

## Command Reference

| Command             | Alias      | Description                 | Plain Output              |
| ------------------- | ---------- | --------------------------- | ------------------------- |
| `validate-ip`       | `vip`      | Validate IPv4 address       | `valid` / `invalid`       |
| `validate-mask`     | `vmask`    | Validate subnet mask        | `valid` / `invalid`       |
| `validate-cidr`     | `vcidr`    | Validate CIDR notation      | `valid` / `invalid`       |
| `validate-batch`    | `vbatch`   | Validate multiple IPs       | Valid IPs (one per line)  |
| `to-binary`         | `bin`      | Convert IP to binary        | Binary string             |
| `from-binary`       | `fbin`     | Convert binary to IP        | IP address                |
| `to-integer`        | `int`      | Convert IP to integer       | Integer / Hex             |
| `from-integer`      | `fint`     | Convert integer to IP       | IP address                |
| `cidr-to-mask`      | `c2m`      | Convert CIDR to subnet mask | Subnet mask               |
| `mask-to-cidr`      | `m2c`      | Convert subnet mask to CIDR | CIDR prefix               |
| `convert`           | `cvt`      | Show all IP representations | Tab-separated values      |
| `subnet-info`       | `sinfo`    | Get subnet information      | Tab-separated subnet data |
| `network-address`   | `netaddr`  | Calculate network address   | Network address           |
| `broadcast-address` | `bcast`    | Calculate broadcast address | Broadcast address         |
| `in-subnet`         | `insubnet` | Check subnet membership     | `true` / `false`          |
| `classify`          | `class`    | Classify as public/private  | `public` / `private`      |
| `next`              | -          | Get next IP address         | IPs (one per line)        |
| `previous`          | `prev`     | Get previous IP address     | IPs (one per line)        |
| `range`             | -          | Generate IP range           | IPs (one per line)        |
| `compare`           | `cmp`      | Compare two IPs             | `-1` / `0` / `1`          |

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

# Generate DHCP scope from subnet
INFO=$(ipnav sinfo 192.168.1.0 255.255.255.0 --plain)
echo "First: $(echo $INFO | cut -f3)"
echo "Last: $(echo $INFO | cut -f4)"
```

### Security & Penetration Testing

```bash
# Generate target list for nmap
ipnav range 192.168.1.1 192.168.1.254 --plain | nmap -sV -iL -

# Scan with masscan
ipnav range 10.0.0.1 10.0.0.255 --plain | masscan -p80,443,8080 -iL -

# Filter private IPs for internal testing
cat all_targets.txt | while read ip; do
  [ "$(ipnav classify $ip --plain)" = "private" ] && echo $ip
done > internal_targets.txt

# Validate targets before scanning
ipnav vbatch $(cat targets.txt) --plain > valid_targets.txt
```

### Development & Testing

```bash
# Generate test IP addresses
ipnav range 192.168.1.1 192.168.1.10

# Convert IPs for different formats
ipnav convert 172.16.0.1

# Get sequential IPs for testing
ipnav next 10.0.0.1 --count 5

# Batch convert IPs to integers
cat ips.txt | while read ip; do
  echo "$ip -> $(ipnav int $ip --plain)"
done
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
if ipnav validate-ip "$1" --plain | grep -q "valid"; then
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

# Pipe to nmap for network scanning
ipnav range 192.168.1.1 192.168.1.254 --plain | nmap -iL -
```

### Combine with Other Tools

```bash
# Extract IPs from logs and validate them
grep -oE '\b([0-9]{1,3}\.){3}[0-9]{1,3}\b' access.log | \
  sort -u | \
  xargs ipnav validate-batch

# Scan only private IPs from a list
for ip in $(cat mixed_ips.txt); do
  if [ "$(ipnav classify $ip --plain)" = "private" ]; then
    echo "$ip" | nmap -iL -
  fi
done

# Get subnet info and extract specific fields
NETWORK=$(ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f1)
USABLE=$(ipnav sinfo 192.168.1.0 255.255.255.0 --plain | cut -f6)
echo "Network: $NETWORK has $USABLE usable hosts"
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
````
