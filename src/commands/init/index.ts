import { copyFile, createDirectory, createFile, getBlockFromFile, isEmptyPath } from "../../utils/fs";
import { addModuleLink, getAvailableModules } from "./utils";
import { chooseModules } from "./prompts";
import { getAutoAnswers, getAutoParameters, getUserParameters, replaceAutoParameters, replaceUserParameters } from "../../utils/markdown";
import { askParameters } from "../../core/prompts";
import { config } from "../../core/config";

export const runInit = async () => {
  if (isEmptyPath(config.currentPath)) {
  
    // Ask for modules to include
    const modules = getAvailableModules()
    console.log("Available modules:", modules)
    const selectedModules = await chooseModules(modules)
    
    // Crear un index principal con los links de los modulos elegidos
    copyFile(`${config.defaultsPath}/templates/main_index.md`, `${config.currentPath}/index.md`)

    // Modificar el index con los parámetros de usuario
    const parameters = getUserParameters(`${config.currentPath}/index.md`)
    const answers = await askParameters(parameters)
    replaceUserParameters(`${config.currentPath}/index.md`, answers);

    // Modificar el index con los parámetros automáticos
    const autoParameters = getAutoParameters(`${config.currentPath}/index.md`)
    const autoAnswers: { [key: string]: string } = getAutoAnswers(autoParameters)
    replaceAutoParameters(`${config.currentPath}/index.md`, autoAnswers);
    
    // Crear una carpeta templates
    createDirectory(config.currentPath, 'templates')

    for (let mod of selectedModules) {
      // Crear una carpeta por cada modulo elegido
      createDirectory(config.currentPath, mod)
      // Crear index dentro de cada modulo
      const indexContent = getBlockFromFile(`${config.defaultsPath}/templates/modules_index.md`, mod);
      createFile(`${config.currentPath}/${mod}/index.md`, indexContent)
      // Mover los templates dentro de la carpeta templates
      copyFile(`${config.defaultsPath}/templates/_TEMPLATE_${mod}.md`, `${config.currentPath}/templates/_TEMPLATE_${mod}.md`)
      // Añadir al index.md el indice con los modulos
      addModuleLink(`${config.currentPath}/index.md`, mod);
    }
  } else {
    console.log("The directory should be empty")
  }
}