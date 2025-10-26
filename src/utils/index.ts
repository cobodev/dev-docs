import fs from 'node:fs'
import path from 'node:path'

export const isEmptyPath = (dir: string): boolean => {
  try {
    const items = fs.readdirSync(dir);
    return items.length === 0;
  } catch (error) {
    // throw error
    return false;
  }
}

export const pathExists = (dir: string): boolean => {
  try {
    return fs.existsSync(dir);
  } catch (err) {
    return false;
  }
};

export const getModules = (dir: string): string[] => {
  try {
    const items = fs.readdirSync(dir);
    return items.filter(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      return stats.isDirectory() && item !== 'templates';
    });
  } catch (error) {
    console.error(`Error getting modules: ${error}`);
    return [];
  }
}

export const copyFile = (sourceDir: string, destinationDir: string) => {
  try {
    fs.copyFileSync(sourceDir, destinationDir);
  } catch (error) {
    // throw error
  }
}

export const createFile = (filePath: string, content: string = ''): void => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Error creating file at ${filePath}: ${error}`);
    throw error;
  }
}

export const createDirectory = (dir: string, name: string): void => {
  try {
    fs.mkdirSync(path.join(dir, name));
  } catch (error) {
    console.error(`Error creating directory ${name} in ${dir}: ${error}`);
    throw error;
  }
};

export const replaceInFile = (filePath: string, replacements: { [key: string]: string }, auto: boolean = false) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    for (const [key, value] of Object.entries(replacements)) {
      let regex = new RegExp(`{{${key}}}`, "g");
      if (auto) {
        regex = new RegExp(`{{@${key}}}`, "g");
      }
      content = content.replace(regex, value);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Error replacing in file:', error);
    // throw error
  }
}

export const getParametersFromFile = (filePath: string, auto: boolean = false): string[] => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let regex = /{{(?!@)(.*?)}}/g;
    if (auto) {
      regex = /{{@(.*?)}}/g;
    }
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

export const addModuleLink = (indexPath: string, moduleName: string): void => {
  try {
    let content = fs.readFileSync(indexPath, 'utf-8');
    const marker = '<!-- MODULES -->';
    const linkLine = `- [${moduleName}](./${moduleName}/index.md)\n`;

    if (content.includes(marker)) {
      // Insert the link right after the marker
      content = content.replace(marker, `${marker}\n${linkLine}`);
    } else {
      // If the marker is missing, append it at the end
      console.warn(`Marker not found in ${indexPath}. Appending link at the end.`);
      content += `\n${marker}\n${linkLine}`;
    }

    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log(`✅ Added link for module "${moduleName}" to ${indexPath}`);
  } catch (error) {
    console.error('❌ Error creating module link:', error);
  }
}

export const addDocLinkToIndex = (indexPath: string, docName: string, title: string): void => {
  try {
    let content = fs.readFileSync(indexPath, 'utf-8');
    const linkLine = `\n- [${title}](./${docName})\n`;
    content = content + linkLine;
    fs.writeFileSync(indexPath, content, 'utf-8');
  } catch (error) {
    console.error('Error adding doc link to index:', error);
  }
}

export const getBlockFromFile = (filePath: string, moduleName: string): string => {
  try {
    const marker = moduleName.toUpperCase();
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = new RegExp(`<!-- ${marker} START -->([\\s\\S]*?)<!-- ${marker} END -->`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  } catch (error) {
    console.error(`Error getting block from file ${filePath}:`, error);
    return '';
  }
}

export const sanitizeFileName = (name: string): string => {
  return name
    .toLowerCase()                          // todo en minúsculas
    .normalize('NFD')                       // separa acentos de las letras
    .replace(/[\u0300-\u036f]/g, '')        // elimina acentos
    .replace(/[^a-z0-9\s_-]/g, '')          // elimina caracteres no válidos
    .trim()                                 // elimina espacios al inicio/fin
    .replace(/\s+/g, '-')                   // espacios → guiones bajos
    .replace(/_+/g, '-'); 
}

export const getAutoAnswers = (parameters: string[]): { [key: string]: string } => {
  const answers: { [key: string]: string } = {}
  console.log('Auto parameters:', parameters)
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
