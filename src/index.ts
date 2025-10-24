#!/usr/bin/env node
import { bold, error, success } from './messages';
import { askDefaultModules, askProjectName, chooseModule } from './prompts';
import { copyFile, createDirectory, getModules, isEmptyPath, pathExists } from './utils';

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
    copyFile(`${DEFAULTS_PATH}/index.md`, CURRENT_PATH)

    // Modificar el index con el nombre del proyecto
    
    // Crear una carpeta templates
    createDirectory(CURRENT_PATH, 'templates')

    for (let mod of selectedModules) {
      // Crear una carpeta por cada modulo elegido
      createDirectory(CURRENT_PATH, mod)
      // Mover index dentro de cada modulo
      copyFile(`${DEFAULTS_PATH}/${mod}/index.md`, `${CURRENT_PATH}/${mod}/index.md`)
      // Mover los templates dentro de la carpeta templates
      copyFile(`${DEFAULTS_PATH}/${mod}/template.md`, `${CURRENT_PATH}/templates/${mod}_template.md`)
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
    const code = '12345'
    const title = 'hola adios jaja'
    // Creación del .md
    copyFile(`${CURRENT_PATH}/templates/${selectedModule}_template.md`, `${CURRENT_PATH}/${selectedModule}/${code}_${title.replace(' ', '-')}.md`)
    // Sustitución de los parámetros

    // Edición del index.md correspondiente
  }

}

init();