import { config } from "../../core/config.js";
import { getContentFromFile, writeContentToFile } from "../../utils/fs.js";

export const getAvailableModules = (): string[] => {
  return config.availableModules;
}

export const addModuleLink = (indexPath: string, moduleName: string): void => {
  try {
    let content = getContentFromFile(indexPath);
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

    writeContentToFile(indexPath, content);
    console.log(`✅ Added link for module "${moduleName}" to ${indexPath}`);
  } catch (error) {
    console.error('❌ Error creating module link:', error);
  }
}