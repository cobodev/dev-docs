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

export const createDirectory = (dir: string, name: string): void => {
  try {
    fs.mkdirSync(path.join(dir, name));
  } catch (error) {
    console.error(`Error creating directory ${name} in ${dir}: ${error}`);
    throw error;
  }
};

export const replaceInFile = (filePath: string, replacements: { [key: string]: string }) => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    for (const [key, value] of Object.entries(replacements)) {
      const regex = new RegExp(`{{${key}}}`, "g");
      content = content.replace(regex, value);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error('Error replacing in file:', error);
    // throw error
  }
}

export const getParametersFromFile = (filePath: string): string[] => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /{{(.*?)}}/g;
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
    const linkLine = `\n- [${moduleName}](./${moduleName}/index.md)\n`;
    content = content + linkLine;
    fs.writeFileSync(indexPath, content, 'utf-8');
  } catch (error) {
    console.error('Error creating module link:', error);
  }
}

export const addDocLinkToIndex = (indexPath: string, docName: string): void => {
  try {
    let content = fs.readFileSync(indexPath, 'utf-8');
    const linkLine = `\n- [${docName}](./${docName}.md)\n`;
    content = content + linkLine;
    fs.writeFileSync(indexPath, content, 'utf-8');
  } catch (error) {
    console.error('Error adding doc link to index:', error);
  }
}
