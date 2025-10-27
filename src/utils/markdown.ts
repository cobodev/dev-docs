import { getContentFromFile, writeContentToFile } from "./fs";

export const getUserParameters = (filePath: string) => {
  const regex = /{{(?!@)(.*?)}}/g;
  return getParameters(filePath, regex);
}

export const getAutoParameters = (filePath: string) => {
  const regex = /{{@(.*?)}}/g;
  return getParameters(filePath, regex);
}

const getParameters = (filePath: string, regex: RegExp) => {
  try {
    const content = getContentFromFile(filePath);
    const parameters = new Set<string>();
    let match;
    while ((match = regex.exec(content)) !== null) {
      parameters.add(match[1]);
    }
    return Array.from(parameters);
  } catch (error) {
    console.error('Error getting parameters from file:', error);
    return [];
  }
}

export const replaceUserParameters = (filePath: string, replacements: { [key: string]: string }) => {
  replaceParameters(filePath, replacements, false);
}

export const replaceAutoParameters = (filePath: string, replacements: { [key: string]: string }) => {
  replaceParameters(filePath, replacements, true);
}

const replaceParameters = (filePath: string, replacements: { [key: string]: string }, auto: boolean) => {
  try {
    let content = getContentFromFile(filePath);
    
    for (const [key, value] of Object.entries(replacements)) {
      let regex = new RegExp(`{{${key}}}`, "g");
      if (auto) {
        regex = new RegExp(`{{@${key}}}`, "g");
      }
      content = content.replace(regex, value);
    }

    writeContentToFile(filePath, content);
  } catch (error) {
    console.error('Error replacing in file:', error);
    // throw error
  }
}

export const getAutoAnswers = (parameters: string[]): { [key: string]: string } => {
  const answers: { [key: string]: string } = {}
  parameters.forEach(param => {
    if (param === 'date') {
      answers[param] = new Date().toISOString().split('T')[0]
    }
    if (param === 'year') {
      answers[param] = new Date().getFullYear().toString()
    }
    if (param === 'lastUpdated') {
      answers[param] = new Date().toISOString().split('T')[0]
    }
    if (param === 'location') {
      answers[param] = 'test'
    }
  })
  return answers
}