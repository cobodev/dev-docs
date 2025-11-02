export interface AppConfig {
  version: string;
  defaultAuthor: string;
  fixedParams: string[];
  availableModules: string[];
  currentPath: string;
  defaultsPath: string;
}

export interface JsonConfig {
  defaultAuthor?: string;
  params?: {
    fixed: string[];
  };
  availableModules?: string[];
}
