import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function findPackageJson(startDir: string): string {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    const packagePath = join(currentDir, "package.json");
    if (existsSync(packagePath)) {
      return packagePath;
    }
    currentDir = dirname(currentDir);
  }

  throw new Error("package.json not found");
}

const packageJson = JSON.parse(
  readFileSync(findPackageJson(__dirname), "utf-8")
);

import { Command } from "commander";

import { registerValidationCommands } from "@/lib/commands/validation.js";
import { registerConversionCommands } from "@/lib/commands/conversion.js";
import { registerSubnetCommands } from "@/lib/commands/subnet.js";
import { registerOperationCommands } from "@/lib/commands/operation.js";

const program = new Command();

program
  .name("ipnav")
  .description("🌐 CLI tool for IP address operations powered by ip-navigator")
  .version(packageJson.version, "-v, --version", "Display version number")
  .showHelpAfterError("(add --help for additional information)")
  .showSuggestionAfterError()
  .addHelpText(
    "after",
    `
Examples:
  $ ipnav validate-ip 192.168.1.1
  $ ipnav subnet-info 192.168.1.100 255.255.255.0
  $ ipnav convert 10.0.0.1
  $ ipnav classify 8.8.8.8
  $ ipnav range 192.168.1.1 192.168.1.10

For more information on a specific command:
  $ ipnav <command> --help

Documentation: https://www.npmjs.com/package/ip-navigator-cli`
  );

// Register all command groups
registerValidationCommands(program);
registerConversionCommands(program);
registerSubnetCommands(program);
registerOperationCommands(program);

// Handle unknown commands
program.on("command:*", (operands) => {
  console.error(`❌ Unknown command: ${operands[0]}`);
  console.error(`Run 'ipnav --help' to see available commands`);
  process.exit(1);
});

export default program;
