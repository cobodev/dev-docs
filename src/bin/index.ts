#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "../init/index.js";
import { createCommand } from "../create/index.js";

const program = new Command();

program
  .name("docdevs")
  .description("Generador de documentación en Markdown")
  .version("1.0.0");

program.addCommand(initCommand);
program.addCommand(createCommand);

program.parse();
