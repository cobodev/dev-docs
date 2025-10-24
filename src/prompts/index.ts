import { checkbox, confirm, input, search, select } from "@inquirer/prompts";

export const askProjectName = async () => {
  return await input({
    message: "Enter the project name:",
    validate: (input) => input && input != ''
  })
}

export const askDefaultModules = async (modules: string[]) => {
  return await checkbox({
    message: 'Choose the modules you want to create:',
    choices: modules.map(m => ({ value: m, name: m }))
  });
}

export const chooseModule = async (modules: string[]) => {
  return await select({
    message: 'Select the module for your documentation: ',
    choices: modules.map(m => ({ value: m, name: m }))
  });
}
