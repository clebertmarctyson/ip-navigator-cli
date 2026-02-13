import { Command } from "commander";

import { isValidIPAddress } from "ip-navigator/validation";

import {
  isPublicIP,
  isPrivateIP,
  getNextIPAddress,
  getPreviousIPAddress,
  getIPRange,
  compareIPAddresses,
} from "ip-navigator/operation";

/**
 * Registers all IP address operation commands to the CLI program
 */
export function registerOperationCommands(program: Command): void {
  // Classify IP (public/private)
  program
    .command("classify <address>")
    .alias("class")
    .description("Classify IP address as public or private")
    .option("-p, --plain", "Output plain format (public/private only)")
    .action((address: string, options: { plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }

        const isPublic = isPublicIP(address);

        // Plain output mode
        if (options.plain) {
          console.log(isPublic ? "public" : "private");
          return;
        }

        const isPrivate = isPrivateIP(address);

        console.log(`\n🔍 IP Classification:`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`IP Address: ${address}`);
        console.log(
          `Type:       ${isPublic ? "🌐 Public IP" : "🏠 Private IP"}`,
        );

        if (isPrivate) {
          console.log(`Standard:   RFC 1918 (Private Network)`);

          // Determine which private range
          const octets = address.split(".").map(Number);
          if (octets[0] === 10) {
            console.log(`Range:      10.0.0.0 - 10.255.255.255`);
          } else if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) {
            console.log(`Range:      172.16.0.0 - 172.31.255.255`);
          } else if (octets[0] === 192 && octets[1] === 168) {
            console.log(`Range:      192.168.0.0 - 192.168.255.255`);
          }
        }
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      } catch (error) {
        console.error(
          `❌ Error classifying IP: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Get next IP address
  program
    .command("next <address>")
    .description("Get the next IP address in sequence")
    .option("-n, --count <number>", "Get N next IP addresses", "1")
    .option("-p, --plain", "Output plain IP list (one per line)")
    .action((address: string, options: { count: string; plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }

        const count = parseInt(options.count, 10);
        if (isNaN(count) || count < 1 || count > 100) {
          console.error(`❌ Count must be between 1 and 100`);
          process.exit(1);
        }

        let current = address;
        const results: string[] = [];

        for (let i = 0; i < count; i++) {
          current = getNextIPAddress(current);
          results.push(current);
        }

        // Plain output mode
        if (options.plain) {
          results.forEach((ip) => console.log(ip));
          return;
        }

        // Formatted output
        console.log(`Current: ${address}`);
        results.forEach((ip, i) => {
          console.log(`Next ${i + 1}:  ${ip}`);
        });
      } catch (error) {
        console.error(
          `❌ Error getting next IP: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Get previous IP address
  program
    .command("previous <address>")
    .alias("prev")
    .description("Get the previous IP address in sequence")
    .option("-n, --count <number>", "Get N previous IP addresses", "1")
    .option("-p, --plain", "Output plain IP list (one per line)")
    .action((address: string, options: { count: string; plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }

        const count = parseInt(options.count, 10);
        if (isNaN(count) || count < 1 || count > 100) {
          console.error(`❌ Count must be between 1 and 100`);
          process.exit(1);
        }

        let current = address;
        const results: string[] = [];

        for (let i = count; i > 0; i--) {
          current = getPreviousIPAddress(current);
          results.push(current);
        }

        // Plain output mode
        if (options.plain) {
          results.forEach((ip) => console.log(ip));
          return;
        }

        // Formatted output
        results.forEach((ip, i) => {
          console.log(`Prev ${count - i}: ${ip}`);
        });
        console.log(`Current: ${address}`);
      } catch (error) {
        console.error(
          `❌ Error getting previous IP: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Generate IP range
  program
    .command("range <start> <end>")
    .description("Generate all IP addresses between start and end (inclusive)")
    .option("-c, --count", "Only show the count of IPs in range")
    .option(
      "-l, --limit <number>",
      "Limit output to specified number of IPs",
      "100",
    )
    .option("-p, --plain", "Output plain IP list (one per line, no formatting)")
    .action(
      (
        start: string,
        end: string,
        options: { count?: boolean; limit: string; plain?: boolean },
      ) => {
        try {
          if (!isValidIPAddress(start)) {
            console.error(`❌ Invalid start IP address: ${start}`);
            process.exit(1);
          }
          if (!isValidIPAddress(end)) {
            console.error(`❌ Invalid end IP address: ${end}`);
            process.exit(1);
          }

          const comparison = compareIPAddresses(start, end);
          if (comparison > 0) {
            console.error(
              `❌ Start IP (${start}) must be less than or equal to end IP (${end})`,
            );
            process.exit(1);
          }

          const range = getIPRange(start, end);
          const limit = parseInt(options.limit, 10);

          // Plain output mode for piping to tools like nmap
          if (options.plain) {
            range.forEach((ip) => {
              console.log(ip);
            });
            return;
          }

          if (options.count) {
            console.log(`\n📊 IP Range Information:`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`Start:  ${start}`);
            console.log(`End:    ${end}`);
            console.log(`Count:  ${range.length.toLocaleString()} addresses`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
          } else {
            if (range.length > limit) {
              console.log(
                `\n⚠️  Range contains ${range.length.toLocaleString()} IPs. Showing first ${limit}:\n`,
              );
              range.slice(0, limit).forEach((ip, idx) => {
                console.log(`${(idx + 1).toString().padStart(3, " ")}. ${ip}`);
              });
              console.log(
                `\n... and ${(
                  range.length - limit
                ).toLocaleString()} more addresses`,
              );
              console.log(
                `\nTip: Use --count to see total or --limit N to show more`,
              );
            } else {
              console.log(
                `\n📋 IP Range (${range.length.toLocaleString()} addresses):\n`,
              );
              range.forEach((ip, idx) => {
                console.log(`${(idx + 1).toString().padStart(3, " ")}. ${ip}`);
              });
            }
          }
        } catch (error) {
          console.error(
            `❌ Error generating IP range: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          process.exit(1);
        }
      },
    );

  // Compare IP addresses
  program
    .command("compare <ip1> <ip2>")
    .alias("cmp")
    .description("Compare two IP addresses numerically")
    .option(
      "-p, --plain",
      "Output plain format (-1 for less, 0 for equal, 1 for greater)",
    )
    .action((ip1: string, ip2: string, options: { plain?: boolean }) => {
      try {
        if (!isValidIPAddress(ip1)) {
          console.error(`❌ Invalid IP address: ${ip1}`);
          process.exit(1);
        }
        if (!isValidIPAddress(ip2)) {
          console.error(`❌ Invalid IP address: ${ip2}`);
          process.exit(1);
        }

        const result = compareIPAddresses(ip1, ip2);

        // Plain output mode
        if (options.plain) {
          console.log(result);
          return;
        }

        console.log(`\n🔢 IP Comparison:`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`IP 1:   ${ip1}`);
        console.log(`IP 2:   ${ip2}`);

        if (result < 0) {
          console.log(`Result: ${ip1} < ${ip2} (IP 1 is smaller)`);
        } else if (result > 0) {
          console.log(`Result: ${ip1} > ${ip2} (IP 1 is larger)`);
        } else {
          console.log(`Result: ${ip1} = ${ip2} (IPs are equal)`);
        }
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      } catch (error) {
        console.error(
          `❌ Error comparing IPs: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });
}
