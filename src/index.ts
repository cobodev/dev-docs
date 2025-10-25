#!/usr/bin/env node
import { bold, error, success } from './messages';
import { askDefaultModules, askParameters, askProjectName, chooseModule } from './prompts';
import { addDocLinkToIndex, addModuleLink, copyFile, createDirectory, getModules, getParametersFromFile, isEmptyPath, pathExists, replaceInFile } from './utils';

const CURRENT_PATH = './'
const DEFAULTS_PATH = `${__dirname}/../defaults`

const exit = async () => {
  error('Project setup cancelled.')
  process.exit(0);
}

const init = async (): Promise<void> => {
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
    const answers = await askParameters(parameters)
    console.log(answers)

    const code = '12345'
    const title = 'hola adios jaja'
    // Creación del .md
    copyFile(`${CURRENT_PATH}/templates/${selectedModule}_template.md`, `${CURRENT_PATH}/${selectedModule}/${code}_${title.replace(' ', '-')}.md`)
    // Sustitución de los parámetros
    replaceInFile(`${CURRENT_PATH}/${selectedModule}/${code}_${title.replace(' ', '-')}.md`, answers);
    // Edición del index.md correspondiente
    addDocLinkToIndex(`${CURRENT_PATH}/index.md`, `${selectedModule}/${code}_${title.replace(' ', '-')}.md`)
  }

}

init();