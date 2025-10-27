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
}

export const getContentFromFile = (filePath: string): string => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file at ${filePath}: ${error}`);
    return '';
  }
}

export const writeContentToFile = (filePath: string, content: string): void => {
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
  } catch (error) {
    console.error(`Error writing to file at ${filePath}: ${error}`);
    throw error;
  }
}

export const getBlockFromFile = (filePath: string, moduleName: string): string => {
  try {
    const marker = moduleName.toUpperCase();
    const content = getContentFromFile(filePath);
    const regex = new RegExp(`<!-- ${marker} START -->([\\s\\S]*?)<!-- ${marker} END -->`, 'g');
    const match = regex.exec(content);
    return match ? match[1].trim() : '';
  } catch (error) {
    console.error(`Error getting block from file ${filePath}:`, error);
    return '';
  }
}

