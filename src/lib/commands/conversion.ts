import { Command } from "commander";

import {
  ipToBinary,
  binaryToIP,
  ipToInteger,
  integerToIP,
  cidrToSubnetMask,
  subnetMaskToCIDR,
} from "ip-navigator/conversion";

import { isValidIPAddress, isValidSubnetMask } from "ip-navigator/validation";

/**
 * Registers all IP conversion commands to the CLI program
 */
export function registerConversionCommands(program: Command): void {
  // IP to Binary conversion
  program
    .command("to-binary <address>")
    .alias("bin")
    .description("Convert IP address to binary representation")
    .option("-s, --spaces", "Use spaces instead of dots as separators")
    .option("-p, --plain", "Output only the binary value")
    .action(
      (address: string, options: { spaces?: boolean; plain?: boolean }) => {
        try {
          if (!isValidIPAddress(address)) {
            console.error(`❌ Invalid IP address: ${address}`);
            process.exit(1);
          }

          const binary = ipToBinary(address);
          const formatted = options.spaces
            ? binary.replace(/\./g, " ")
            : binary;

          // Plain output mode
          if (options.plain) {
            console.log(formatted);
            return;
          }

          console.log(`IP Address: ${address}`);
          console.log(`Binary:     ${formatted}`);
        } catch (error) {
          console.error(
            `❌ Error converting to binary: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          process.exit(1);
        }
      },
    );

  // Binary to IP conversion
  program
    .command("from-binary <binary>")
    .alias("fbin")
    .description(
      "Convert binary to IP address (format: 11000000.10101000.00000001.00000001)",
    )
    .option("-p, --plain", "Output only the IP address")
    .action((binary: string, options: { plain?: boolean }) => {
      try {
        // Allow both dot-separated and space-separated binary
        const normalizedBinary = binary.replace(/\s+/g, ".");
        const ip = binaryToIP(normalizedBinary);

        // Plain output mode
        if (options.plain) {
          console.log(ip);
          return;
        }

        console.log(`Binary:     ${normalizedBinary}`);
        console.log(`IP Address: ${ip}`);
      } catch (error) {
        console.error(
          `❌ Error converting from binary: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        console.error(
          "Expected format: 11000000.10101000.00000001.00000001 or space-separated",
        );
        process.exit(1);
      }
    });

  // IP to Integer conversion
  program
    .command("to-integer <address>")
    .alias("int")
    .description("Convert IP address to 32-bit integer")
    .option("-h, --hex", "Display result in hexadecimal")
    .option("-p, --plain", "Output only the integer value")
    .action((address: string, options: { hex?: boolean; plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }

        const integer = ipToInteger(address);

        // Plain output mode
        if (options.plain) {
          if (options.hex) {
            console.log(`0x${integer.toString(16).toUpperCase()}`);
          } else {
            console.log(integer);
          }
          return;
        }

        console.log(`IP Address: ${address}`);
        console.log(`Integer:    ${integer}`);

        if (options.hex) {
          console.log(`Hexadecimal: 0x${integer.toString(16).toUpperCase()}`);
        }
      } catch (error) {
        console.error(
          `❌ Error converting to integer: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Integer to IP conversion
  program
    .command("from-integer <number>")
    .alias("fint")
    .description("Convert 32-bit integer to IP address")
    .option("-p, --plain", "Output only the IP address")
    .action((number: string, options: { plain?: boolean }) => {
      try {
        const integer = parseInt(number, 10);

        if (isNaN(integer) || integer < 0 || integer > 4294967295) {
          console.error(`❌ Invalid integer: ${number}`);
          console.error("Expected range: 0 to 4294967295 (2^32 - 1)");
          process.exit(1);
        }

        const ip = integerToIP(integer);

        // Plain output mode
        if (options.plain) {
          console.log(ip);
          return;
        }

        console.log(`Integer:    ${integer}`);
        console.log(`IP Address: ${ip}`);
      } catch (error) {
        console.error(
          `❌ Error converting from integer: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // CIDR to Subnet Mask conversion
  program
    .command("cidr-to-mask <prefix>")
    .alias("c2m")
    .description(
      "Convert CIDR prefix to subnet mask (e.g., 24 → 255.255.255.0)",
    )
    .option("-p, --plain", "Output only the subnet mask")
    .action((prefix: string, options: { plain?: boolean }) => {
      try {
        const prefixNum = parseInt(prefix, 10);

        if (isNaN(prefixNum) || prefixNum < 0 || prefixNum > 32) {
          console.error(`❌ Invalid CIDR prefix: ${prefix}`);
          console.error("Expected range: 0 to 32");
          process.exit(1);
        }

        const mask = cidrToSubnetMask(prefixNum);

        // Plain output mode
        if (options.plain) {
          console.log(mask);
          return;
        }

        console.log(`CIDR Prefix:  /${prefixNum}`);
        console.log(`Subnet Mask:  ${mask}`);
        console.log(`Binary:       ${ipToBinary(mask)}`);
      } catch (error) {
        console.error(
          `❌ Error converting CIDR to mask: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Subnet Mask to CIDR conversion
  program
    .command("mask-to-cidr <mask>")
    .alias("m2c")
    .description(
      "Convert subnet mask to CIDR prefix (e.g., 255.255.255.0 → /24)",
    )
    .option("-p, --plain", "Output only the CIDR prefix (without /)")
    .action((mask: string, options: { plain?: boolean }) => {
      try {
        if (!isValidSubnetMask(mask)) {
          console.error(`❌ Invalid subnet mask: ${mask}`);
          process.exit(1);
        }

        const cidr = subnetMaskToCIDR(mask);

        // Plain output mode
        if (options.plain) {
          console.log(cidr);
          return;
        }

        console.log(`Subnet Mask:  ${mask}`);
        console.log(`CIDR Prefix:  /${cidr}`);
        console.log(`Binary:       ${ipToBinary(mask)}`);
      } catch (error) {
        console.error(
          `❌ Error converting mask to CIDR: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // All-in-one conversion command
  program
    .command("convert <address>")
    .alias("cvt")
    .description("Show all representations of an IP address")
    .option(
      "-p, --plain",
      "Output tab-separated values: decimal binary integer hex",
    )
    .action((address: string, options: { plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }

        const binary = ipToBinary(address);
        const integer = ipToInteger(address);
        const hex = `0x${integer.toString(16).toUpperCase()}`;

        // Plain output mode - tab separated for easy parsing
        if (options.plain) {
          console.log(`${address}\t${binary}\t${integer}\t${hex}`);
          return;
        }

        console.log(`\n🔢 IP Address Representations:`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Decimal:     ${address}`);
        console.log(`Binary:      ${binary}`);
        console.log(`Integer:     ${integer}`);
        console.log(`Hexadecimal: ${hex}`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      } catch (error) {
        console.error(
          `❌ Error during conversion: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });
}
