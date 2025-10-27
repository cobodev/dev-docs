import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Config .env
dotenv.config({ path: `${__dirname}/../../defaults/default.env` });

// Carga config.json
const jsonConfigPath = path.resolve(`${__dirname}/../../defaults/config.json`);
let jsonConfig: any = {};
if (fs.existsSync(jsonConfigPath)) {
  jsonConfig = JSON.parse(fs.readFileSync(jsonConfigPath, 'utf8'));
}

// Combina todo en un solo objeto tipado
export const config = {
  version: process.env.VERSION || "1.0.0",
  defaultAuthor: jsonConfig.defaultAuthor,
  fixedParams: jsonConfig.params?.fixed || [],
  availableModules: jsonConfig.availableModules || [],
  currentPath: process.env.CURRENT_PATH || './',
  defaultsPath: `${__dirname}/${process.env.DEFAULTS_PATH}`,
};
