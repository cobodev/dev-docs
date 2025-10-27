import { select } from "@inquirer/prompts";

export const chooseModule = async (modules: string[]) => {
  return await select({
    message: 'Select the module for your documentation: ',
    choices: modules.map(m => ({ value: m, name: m }))
  });
}