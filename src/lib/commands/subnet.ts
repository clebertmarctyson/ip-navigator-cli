import { Command } from "commander";

import { isValidIPAddress, isValidSubnetMask } from "ip-navigator/validation";

import { cidrToSubnetMask } from "ip-navigator/conversion";

import {
  calculateBroadcastAddress,
  calculateNetworkAddress,
  getSubnetInfo,
} from "ip-navigator/subnet";

import { isIPAddressInSubnet } from "ip-navigator/operation";

/**
 * Registers all subnet operation commands to the CLI program
 */
export function registerSubnetCommands(program: Command): void {
  // Comprehensive subnet information
  program
    .command("subnet-info <address> [mask]")
    .alias("sinfo")
    .description("Get comprehensive subnet information")
    .option("-c, --cidr <prefix>", "Use CIDR notation instead of subnet mask")
    .option(
      "-p, --plain",
      "Output tab-separated values: network broadcast firstUsable lastUsable totalHosts usableHosts",
    )
    .action(
      (
        address: string,
        mask: string | undefined,
        options: { cidr?: string; plain?: boolean },
      ) => {
        try {
          if (!isValidIPAddress(address)) {
            console.error(`❌ Invalid IP address: ${address}`);
            process.exit(1);
          }

          let subnetMask: string;

          if (options.cidr) {
            const cidr = parseInt(options.cidr, 10);
            if (isNaN(cidr) || cidr < 0 || cidr > 32) {
              console.error(`❌ Invalid CIDR prefix: ${options.cidr}`);
              process.exit(1);
            }
            subnetMask = cidrToSubnetMask(cidr);
          } else if (mask) {
            if (!isValidSubnetMask(mask)) {
              console.error(`❌ Invalid subnet mask: ${mask}`);
              process.exit(1);
            }
            subnetMask = mask;
          } else {
            console.error(
              "❌ Please provide either a subnet mask or use --cidr flag",
            );
            process.exit(1);
          }

          const info = getSubnetInfo(address, subnetMask);

          // Plain output mode - tab separated for easy parsing
          if (options.plain) {
            console.log(
              `${info.networkAddress}\t${info.broadcastAddress}\t${info.firstUsableHost}\t${info.lastUsableHost}\t${info.totalHosts}\t${info.usableHosts}`,
            );
            return;
          }

          console.log(`\n📊 Subnet Information:`);
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          console.log(`IP Address:        ${address}`);
          console.log(`Subnet Mask:       ${subnetMask}`);
          console.log(`Network Address:   ${info.networkAddress}`);
          console.log(`Broadcast Address: ${info.broadcastAddress}`);
          console.log(`First Usable:      ${info.firstUsableHost}`);
          console.log(`Last Usable:       ${info.lastUsableHost}`);
          console.log(`Total Hosts:       ${info.totalHosts.toLocaleString()}`);
          console.log(
            `Usable Hosts:      ${info.usableHosts.toLocaleString()}`,
          );
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        } catch (error) {
          console.error(
            `❌ Error calculating subnet info: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          process.exit(1);
        }
      },
    );

  // Network address calculation
  program
    .command("network-address <address> <mask>")
    .alias("netaddr")
    .description("Calculate network address from IP and subnet mask")
    .option("-p, --plain", "Output only the network address")
    .action((address: string, mask: string, options: { plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }
        if (!isValidSubnetMask(mask)) {
          console.error(`❌ Invalid subnet mask: ${mask}`);
          process.exit(1);
        }

        const networkAddr = calculateNetworkAddress(address, mask);

        // Plain output mode
        if (options.plain) {
          console.log(networkAddr);
          return;
        }

        console.log(`Network Address: ${networkAddr}`);
      } catch (error) {
        console.error(
          `❌ Error calculating network address: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Broadcast address calculation
  program
    .command("broadcast-address <address> <mask>")
    .alias("bcast")
    .description("Calculate broadcast address from IP and subnet mask")
    .option("-p, --plain", "Output only the broadcast address")
    .action((address: string, mask: string, options: { plain?: boolean }) => {
      try {
        if (!isValidIPAddress(address)) {
          console.error(`❌ Invalid IP address: ${address}`);
          process.exit(1);
        }
        if (!isValidSubnetMask(mask)) {
          console.error(`❌ Invalid subnet mask: ${mask}`);
          process.exit(1);
        }

        const broadcastAddr = calculateBroadcastAddress(address, mask);

        // Plain output mode
        if (options.plain) {
          console.log(broadcastAddr);
          return;
        }

        console.log(`Broadcast Address: ${broadcastAddr}`);
      } catch (error) {
        console.error(
          `❌ Error calculating broadcast address: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
        process.exit(1);
      }
    });

  // Check if IP is in subnet
  program
    .command("in-subnet <address> <network> <mask>")
    .alias("insubnet")
    .description("Check if an IP address belongs to a subnet")
    .option("-p, --plain", "Output only 'true' or 'false'")
    .action(
      (
        address: string,
        network: string,
        mask: string,
        options: { plain?: boolean },
      ) => {
        try {
          if (!isValidIPAddress(address)) {
            console.error(`❌ Invalid IP address: ${address}`);
            process.exit(1);
          }
          if (!isValidIPAddress(network)) {
            console.error(`❌ Invalid network address: ${network}`);
            process.exit(1);
          }
          if (!isValidSubnetMask(mask)) {
            console.error(`❌ Invalid subnet mask: ${mask}`);
            process.exit(1);
          }

          const isInSubnet = isIPAddressInSubnet(address, network, mask);

          // Plain output mode
          if (options.plain) {
            console.log(isInSubnet ? "true" : "false");
            process.exit(isInSubnet ? 0 : 1);
            return;
          }

          if (isInSubnet) {
            console.log(`✅ ${address} belongs to subnet ${network}/${mask}`);
            process.exit(0);
          } else {
            console.log(
              `❌ ${address} does NOT belong to subnet ${network}/${mask}`,
            );
            process.exit(1);
          }
        } catch (error) {
          console.error(
            `❌ Error checking subnet membership: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
          process.exit(1);
        }
      },
    );
}
