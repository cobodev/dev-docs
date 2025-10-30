import { copyFile, createDirectory, createFile, getBlockFromFile, isEmptyPath } from "../../utils/fs";
import { addModuleLink, getAvailableModules } from "./utils";
import { chooseModules } from "./prompts";
import { getAutoAnswers, getAutoParameters, getUserParameters, replaceAutoParameters, replaceUserParameters } from "../../utils/markdown";
import { askParameters } from "../../core/prompts";
import { config } from "../../core/config";
import { logger } from "../../core/logger";
import { exit } from "../../utils/process";

export const runInit = async () => {
  try {
    logger.info("Initializing a new documentation project...");

    if (!isEmptyPath(config.currentPath)) {
      logger.error("The path is not empty. Please choose an empty directory to initialize the documentation project.");
      exit()
    }
    
    // Ask for modules to include
    const modules = getAvailableModules()
    const selectedModules = await chooseModules(modules)
    
    logger.info('Creating main index');
    // Create main index.md
    copyFile(`${config.defaultsPath}/templates/main_index.md`, `${config.currentPath}/index.md`)

    // Modify index.md with user parameters
    const parameters = getUserParameters(`${config.currentPath}/index.md`)
    const answers = await askParameters(parameters)
    replaceUserParameters(`${config.currentPath}/index.md`, answers);

    // Modify index.md with auto parameters
    const autoParameters = getAutoParameters(`${config.currentPath}/index.md`)
    const autoAnswers: { [key: string]: string } = getAutoAnswers(autoParameters)
    replaceAutoParameters(`${config.currentPath}/index.md`, autoAnswers);
    
    // Create templates folder
    createDirectory(config.currentPath, 'templates')

    logger.info('Creating modules...');
    for (let mod of selectedModules) {
      // Create a folder for each selected module
      createDirectory(config.currentPath, mod)
      // Create index.md inside each module
      const indexContent = getBlockFromFile(`${config.defaultsPath}/templates/modules_index.md`, mod);
      createFile(`${config.currentPath}/${mod}/index.md`, indexContent)
      // Move templates into the templates folder
      copyFile(`${config.defaultsPath}/templates/_TEMPLATE_${mod}.md`, `${config.currentPath}/templates/_TEMPLATE_${mod}.md`)
      // Add module link to the main index.md
      addModuleLink(`${config.currentPath}/index.md`, mod);
    }

    logger.info("Documentation project initialized successfully.");
    logger.info(`Don't forget to check the templates folder to add your content`);
  
  } catch (error) {
    logger.error("Error during project initialization", error)
    exit()
  }
}