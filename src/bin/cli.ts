#!/usr/bin/env node
import { Command } from "commander";
import { runInit } from "../commands/init/index.js";
import { runNew } from "../commands/new/index.js";
import { config } from "../core/config.js";
import { logger } from "../core/logger.js";

const program = new Command();

logger.info(`DevDocs CLI - Version ${config.version}`);
logger.info(`Config Path: ${config.defaultsPath}`);
logger.info(`Current Path: ${config.currentPath}`);

program
  .name("devdocs")
  .description("A CLI tool to manage development documentation.")
  .version(config.version);

program
  .command("init")
  .description("Initialize a new documentation project.")
  .action(runInit);

program
  .command("new")
  .argument("[type]", "module | doc", "doc")
  .description("Create new module or document. Doc by default.")
  .action((type: string) => runNew(type));

program.parse();
