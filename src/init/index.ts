import { Command } from "commander";
import { addModuleLink, copyFile, createDirectory, getModules, isEmptyPath, replaceInFile } from "../utils";
import { askDefaultModules, askProjectName } from "../prompts";

const CURRENT_PATH = './'
const DEFAULTS_PATH = `${__dirname}/../defaults`

export const initCommand = new Command("init")
  .description("Inicializa la estructura base de documentación")
  .action(async () => {
    if (isEmptyPath(CURRENT_PATH)) {
      const projectName = await askProjectName()
      const modules = getModules(DEFAULTS_PATH)
      const selectedModules = await askDefaultModules(modules)
      
      // Crear un index principal con los links de los modulos elegidos
      copyFile(`${DEFAULTS_PATH}/index.md`, `${CURRENT_PATH}/index.md`)
  
      // Modificar el index con el nombre del proyecto
      replaceInFile(`${CURRENT_PATH}/index.md`, { 'project name': projectName });
      
      // Crear una carpeta templates
      createDirectory(CURRENT_PATH, 'templates')
  
      for (let mod of selectedModules) {
        // Crear una carpeta por cada modulo elegido
        createDirectory(CURRENT_PATH, mod)
        // Mover index dentro de cada modulo
        copyFile(`${DEFAULTS_PATH}/${mod}/index.md`, `${CURRENT_PATH}/${mod}/index.md`)
        // Mover los templates dentro de la carpeta templates
        copyFile(`${DEFAULTS_PATH}/${mod}/template.md`, `${CURRENT_PATH}/templates/${mod}_template.md`)
        // Añadir al index.md el indice con los modulos
        addModuleLink(`${CURRENT_PATH}/index.md`, mod);
      }
    } else {
      console.log("The directory should be empty")
    }
  });
