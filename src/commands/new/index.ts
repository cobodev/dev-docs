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
  logger.info("Creating a new document...");
  // Comprobaciones previas
  const existIndex = pathExists(`${config.currentPath}/index.md`)
  const existTemplatesFolder = pathExists(`${config.currentPath}/templates`)

  if (!existIndex && !existTemplatesFolder) {
    logger.error("No esta en la ruta correcta.");
    exit()
  }

  // Preguntar que quiere crear (modulos)
  const modules = getModules(config.currentPath)
  const selectedModule = await chooseModule(modules)

  // Parametros de usuario
  const parameters = getUserParameters(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`)
  // TODO: hacer esto con los fixed params
  if (!parameters.find(param => param === 'title')) {
    parameters.unshift('title')
  }
  const answers = await askParameters(parameters)
  
  // Parametros automáticos
  const autoParameters = getAutoParameters(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`)
  const autoAnswers: { [key: string]: string } = getAutoAnswers(autoParameters)
  
  // TODO: Investigar forma de configurar que parámetros conformarán el nombre del fichero
  const fileName = sanitizeFileName(answers['title'] || 'untitled')
  
  
  // Creación del .md
  copyFile(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`, `${config.currentPath}/${selectedModule}/${fileName}.md`)
  // Sustitución de los parámetros
  replaceUserParameters(`${config.currentPath}/${selectedModule}/${fileName}.md`, answers);
  replaceAutoParameters(`${config.currentPath}/${selectedModule}/${fileName}.md`, autoAnswers);
  // Edición del index.md correspondiente
  addDocLinkToIndex(`${config.currentPath}/${selectedModule}/index.md`, `${fileName}.md`, answers['title'] || 'untitled')

  logger.info("Document created successfully.");
}

const newModule = async () => {
  console.log("Creating new module...");
  // Preguntar nombre del módulo
  const selectedModule = await askModuleName();
  // Crear carpeta del módulo
  createDirectory(config.currentPath, selectedModule);
  // Crear index.md del módulo
  const indexContent = '# ' + selectedModule + '\n\nWelcome to the ' + selectedModule + ' section.';
  createFile(`${config.currentPath}/${selectedModule}/index.md`, indexContent);
  // Crear template del módulo
  const templateContent = `# _TEMPLATE_${selectedModule}\n\n## Title\n\nYour content goes here.`;
  createFile(`${config.currentPath}/templates/_TEMPLATE_${selectedModule}.md`, templateContent);
  // Añadir referencia al index.md principal
  addModuleLink(`${config.currentPath}/index.md`, selectedModule);

  logger.info("Module created successfully.");
}

export const runNew = (type: string) => {
  console.log(`Running 'new' command with type: ${type}`);
  if (type === "doc") {
    newDoc();
  } else if (type === "module") {
    newModule();
  } else {
    console.log("Unknown type. Please use 'doc' or 'module'.");
  }
}