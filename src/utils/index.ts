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

    const directoryNames = [];
    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory() && item !== 'templates') {
            directoryNames.push(item);
        }
    }

    return directoryNames;

  } catch (error) {
    // throw error
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

export const createDirectory = (dir: string, name: string) => {
  try {
    fs.mkdirSync(`${dir}/${name}`);
  } catch (error) {
    throw error;
  }
}