import { Command } from "commander";
import { addModuleLink, copyFile, createDirectory, createFile, getBlockFromFile, getModules, getParametersFromFile, isEmptyPath, replaceInFile } from "../utils";
import { askDefaultModules, askParameters, askProjectName } from "../prompts";

const CURRENT_PATH = './'
const DEFAULTS_PATH = `${__dirname}/../../defaults`

export const initCommand = new Command("init")
  .description("Inicializa la estructura base de documentación")
  .action(async () => {
    if (isEmptyPath(CURRENT_PATH)) {

      const modules = getModules(DEFAULTS_PATH)
      const selectedModules = await askDefaultModules(modules)
      
      // Crear un index principal con los links de los modulos elegidos
      copyFile(`${DEFAULTS_PATH}/main_index.md`, `${CURRENT_PATH}/index.md`)
  
      // Modificar el index con los parámetros 
      const parameters = getParametersFromFile(`${CURRENT_PATH}/index.md`)
      const answers = await askParameters(parameters)
      replaceInFile(`${CURRENT_PATH}/index.md`, answers);
      
      // Crear una carpeta templates
      createDirectory(CURRENT_PATH, 'templates')
  
      for (let mod of selectedModules) {
        // Crear una carpeta por cada modulo elegido
        createDirectory(CURRENT_PATH, mod)
        // Crear index dentro de cada modulo
        const indexContent = getBlockFromFile(`${DEFAULTS_PATH}/modules_index.md`, mod);
        createFile(`${CURRENT_PATH}/${mod}/index.md`, indexContent)
        // Mover los templates dentro de la carpeta templates
        copyFile(`${DEFAULTS_PATH}/${mod}/template.md`, `${CURRENT_PATH}/templates/${mod}_template.md`)
        // Añadir al index.md el indice con los modulos
        addModuleLink(`${CURRENT_PATH}/index.md`, mod);
      }
    } else {
      console.log("The directory should be empty")
    }
  });
