import { copyFile, createDirectory, createFile, pathExists } from "../../utils/fs";
import { sanitizeFileName } from "../../utils/sanitize";
import { logger } from "../../core/logger";
import { addDocLinkToIndex, getModules } from "./utils";
import { askModuleName, chooseModule } from "./prompts";
import { getAutoAnswers, getAutoParameters, getUserParameters, replaceAutoParameters, replaceUserParameters } from "../../utils/markdown";
import { askParameters } from "../../core/prompts";
import { config } from "../../core/config";
import { exit } from "../../utils/process";
import { addModuleLink } from "../init/utils";

const newDoc = async () => {
  try {
    logger.info("Creating a new document...");

    // Validation of existing project
    const existIndex = pathExists(`${config.currentPath}/index.md`)
    const existTemplatesFolder = pathExists(`${config.currentPath}/templates`)

    if (!existIndex && !existTemplatesFolder) {
      logger.error("No documentation project found in the current directory. Please run 'devdocs init' first.");
      exit()
    }

    // Ask module to add the document to
    const modules = getModules(config.currentPath)
    const selectedModule = await chooseModule(modules)

    // User parameters
    const parameters = getUserParameters(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`)
    
    // Add fixed parameters if not present
    const fixedParameters = config.fixedParams;
    for (let fixedParam of fixedParameters) {
      if (!parameters.find(param => param === fixedParam)) {
        parameters.unshift(fixedParam)
      }
    }
    const answers = await askParameters(parameters)
    
    // Auto parameters
    const autoParameters = getAutoParameters(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`)
    const autoAnswers: { [key: string]: string } = getAutoAnswers(autoParameters)

    if (!answers['title'] || answers['title'].trim() === '') {
      logger.error("The 'title' parameter is required and cannot be empty.");
      exit()
    }
    
    // TODO: Investigar forma de configurar que parámetros conformarán el nombre del fichero
    const fileName = sanitizeFileName(answers['title'] || 'untitled')
    
    // Create the document from the template
    copyFile(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`, `${config.currentPath}/${selectedModule}/${fileName}.md`)
    // Replace parameters
    replaceUserParameters(`${config.currentPath}/${selectedModule}/${fileName}.md`, answers);
    replaceAutoParameters(`${config.currentPath}/${selectedModule}/${fileName}.md`, autoAnswers);
    // Edit corresponding index.md
    addDocLinkToIndex(`${config.currentPath}/${selectedModule}/index.md`, `${fileName}.md`, answers['title'] || 'untitled')

    logger.info(`Document created successfully => ${config.currentPath}/${selectedModule}/${fileName}.md.`);
    logger.info(`Index updated => ${config.currentPath}/${selectedModule}/index.md.`);
    logger.info(`Don't forget to edit the document to add your content.`);

  } catch (error) {
    logger.error('Error creating the document', error);
    exit();
  }
}

const newModule = async () => {
  try {
    logger.info("Creating a new module...");

    // Ask for module name
    const selectedModule = await askModuleName();
    // Create module folder
    createDirectory(config.currentPath, selectedModule);
    // Create index.md for the module
    const indexContent = '# ' + selectedModule + '\n\nWelcome to the ' + selectedModule + ' section.';
    createFile(`${config.currentPath}/${selectedModule}/index.md`, indexContent);
    // Create module template
    const templateContent = `# _TEMPLATE_${selectedModule}\n\n## Title\n\nYour content goes here.`;
    createFile(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`, templateContent);
    // Add reference to the main index.md
    addModuleLink(`${config.currentPath}/index.md`, selectedModule);

    logger.info(`Module '${selectedModule}' created successfully.`);
    logger.info(`Template created => ${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md.`);
    logger.info(`Don't forget to edit the template to add your content.`);
  
  } catch (error) {
    logger.error('Error creating module', error);
    exit();
  }
}

export const runNew = (type: string) => {
  if (type === "doc") {
    newDoc();
  } else if (type === "module") {
    newModule();
  } else {
    logger.error("Unknown type. Please use 'doc' or 'module'.");
  }
}