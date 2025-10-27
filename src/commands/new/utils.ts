import fs from 'node:fs'
import path from 'node:path'
import { getContentFromFile, writeContentToFile } from '../../utils/fs';

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

export const addDocLinkToIndex = (indexPath: string, docName: string, title: string): void => {
  try {
    let content = getContentFromFile(indexPath);
    const linkLine = `\n- [${title}](./${docName})\n`;
    content = content + linkLine;
    writeContentToFile(indexPath, content);
  } catch (error) {
    console.error('Error adding doc link to index:', error);
  }
}