import { logger } from "../core/logger";

export const exit = async () => {
  logger.error('Project setup cancelled.')
  process.exit(0);
}