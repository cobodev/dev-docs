import { Command } from "commander";
import { addDocLinkToIndex, copyFile, getModules, getParametersFromFile, pathExists, replaceInFile, sanitizeFileName } from "../utils";
import { askParameters, chooseModule } from "../prompts";
import { error } from "../messages";

const CURRENT_PATH = './'

const exit = async () => {
  error('Project setup cancelled.')
  process.exit(0);
}

export const createCommand = new Command("create")
  .argument("[module]", "El módulo donde se creará la documentación")
  .argument("[title]", "El título de la documentación")
  .description("Crea un nuevo módulo de documentación")
  .action(async (module?: string) => {
    // Comprobaciones previas
    const existIndex = pathExists(`${CURRENT_PATH}/index.md`)
    const existTemplatesFolder = pathExists(`${CURRENT_PATH}/templates`)

    if (!existIndex && !existTemplatesFolder) {
      console.log("The directory should be empty")
      exit()
    }

    // Preguntar que quiere crear (modulos)
    const modules = getModules(CURRENT_PATH)
    const selectedModule = await chooseModule(modules)
  
    // Resto de preguntas (titulo, ...)
    const parameters = getParametersFromFile(`${CURRENT_PATH}/templates/${selectedModule}_template.md`)
    if (!parameters.find(param => param === 'title')) {
      parameters.unshift('title')
    }
    const answers = await askParameters(parameters)
    console.log(answers)

    // TODO: Investigar forma de configurar que parámetros conformarán el nombre del fichero
    const fileName = sanitizeFileName(answers['title'] || 'untitled')

    // Creación del .md
    copyFile(`${CURRENT_PATH}/templates/${selectedModule}_template.md`, `${CURRENT_PATH}/${selectedModule}/${fileName}.md`)
    // Sustitución de los parámetros
    replaceInFile(`${CURRENT_PATH}/${selectedModule}/${fileName}.md`, answers);
    // Edición del index.md correspondiente
    addDocLinkToIndex(`${CURRENT_PATH}/${selectedModule}/index.md`, `${fileName}.md`, answers['title'] || 'untitled')
});
