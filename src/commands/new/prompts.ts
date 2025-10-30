import { input, select } from "@inquirer/prompts";

export const askModuleName = async () => {
  return await input({
    message: 'Enter the name of the new module: ',
    validate: (input) => input && input.trim() !== '',
  });
}

export const chooseModule = async (modules: string[]) => {
  return await select({
    message: 'Select the module for your documentation: ',
    choices: modules.map(m => ({ value: m, name: m }))
  });
}