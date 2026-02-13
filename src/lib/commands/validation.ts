import { Command } from "commander";

import {
  isValidIPAddress,
  isValidSubnetMask,
  isValidCIDR,
} from "ip-navigator/validation";

/**
 * Registers all IP validation commands to the CLI program
 */
export function registerValidationCommands(program: Command): void {
  // Validate IP address command
  program
    .command("validate-ip <address>")
    .alias("vip")
    .description("Validate an IPv4 address")
    .option("-p, --plain", "Output only 'valid' or 'invalid'")
    .action((address: string, options: { plain?: boolean }) => {
      try {
        const isValid = isValidIPAddress(address);

        // Plain output mode
        if (options.plain) {
          console.log(isValid ? "valid" : "invalid");
          process.exit(isValid ? 0 : 1);
          return;
        }

        if (isValid) {
          console.log(`✅ Valid IP address: ${address}`);
          process.exit(0);
        } else {
          console.error(`❌ Invalid IP address: ${address}`);
          console.error(
            "Expected format: xxx.xxx.xxx.xxx (0-255 for each octet)",
          );
          process.exit(1);
        }
      } catch (error) {
        console.error(
          `❌ Error validating IP address: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Validate subnet mask command
  program
    .command("validate-mask <mask>")
    .alias("vmask")
    .description("Validate a subnet mask")
    .option("-p, --plain", "Output only 'valid' or 'invalid'")
    .action((mask: string, options: { plain?: boolean }) => {
      try {
        const isValid = isValidSubnetMask(mask);

        // Plain output mode
        if (options.plain) {
          console.log(isValid ? "valid" : "invalid");
          process.exit(isValid ? 0 : 1);
          return;
        }

        if (isValid) {
          console.log(`✅ Valid subnet mask: ${mask}`);
          process.exit(0);
        } else {
          console.error(`❌ Invalid subnet mask: ${mask}`);
          console.error(
            "Expected format: valid contiguous binary mask (e.g., 255.255.255.0)",
          );
          process.exit(1);
        }
      } catch (error) {
        console.error(
          `❌ Error validating subnet mask: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Validate CIDR notation command
  program
    .command("validate-cidr <cidr>")
    .alias("vcidr")
    .description("Validate CIDR notation (e.g., 192.168.1.0/24)")
    .option("-p, --plain", "Output only 'valid' or 'invalid'")
    .action((cidr: string, options: { plain?: boolean }) => {
      try {
        const isValid = isValidCIDR(cidr);

        // Plain output mode
        if (options.plain) {
          console.log(isValid ? "valid" : "invalid");
          process.exit(isValid ? 0 : 1);
          return;
        }

        if (isValid) {
          console.log(`✅ Valid CIDR notation: ${cidr}`);
          process.exit(0);
        } else {
          console.error(`❌ Invalid CIDR notation: ${cidr}`);
          console.error(
            "Expected format: xxx.xxx.xxx.xxx/yy (IP address with /0-32 prefix)",
          );
          process.exit(1);
        }
      } catch (error) {
        console.error(
          `❌ Error validating CIDR: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Batch validation command - validate multiple IPs
  program
    .command("validate-batch <addresses...>")
    .alias("vbatch")
    .description("Validate multiple IP addresses at once")
    .option("-q, --quiet", "Only show invalid addresses")
    .option("-p, --plain", "Output only IP addresses (valid IPs only)")
    .action(
      (addresses: string[], options: { quiet?: boolean; plain?: boolean }) => {
        const results = addresses.map((address) => ({
          address,
          isValid: isValidIPAddress(address),
        }));

        const validCount = results.filter((r) => r.isValid).length;
        const invalidCount = results.length - validCount;

        // Plain output mode - only valid IPs, one per line
        if (options.plain) {
          results.forEach(({ address, isValid }) => {
            if (isValid) {
              console.log(address);
            }
          });
          process.exit(invalidCount > 0 ? 1 : 0);
          return;
        }

        if (!options.quiet) {
          results.forEach(({ address, isValid }) => {
            console.log(isValid ? `✅ ${address}` : `❌ ${address}`);
          });
          console.log();
        } else {
          results.forEach(({ address, isValid }) => {
            if (!isValid) {
              console.log(`❌ ${address}`);
            }
          });
        }

        console.log(
          `📊 Summary: ${validCount} valid, ${invalidCount} invalid (${results.length} total)`,
        );
        process.exit(invalidCount > 0 ? 1 : 0);
      },
    );
}
