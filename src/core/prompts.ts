import { input } from "@inquirer/prompts";

export const askParameters = async (parameters: string[]) => {
  const answers: { [key: string]: string } = {};
  for (const param of parameters) {
    answers[param] = await askForParameter(param);
  }
  return answers;
}

const askForParameter = async (parameter: string) => {
  return await input({
    message: `${parameter}:`,
    validate: (input) => input && input != ''
  });
}