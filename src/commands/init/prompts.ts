import { checkbox } from "@inquirer/prompts";

export const chooseModules = async (modules: string[]) => {
  return await checkbox({
    message: 'Choose the modules you want to create:',
    choices: modules.map(m => ({ value: m, name: m })),
  })
}