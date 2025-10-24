import chalk from "chalk";

/**
 * Logs an error message in red color.
 * 
 * @param {string} msg - The error message to display.
 * @param {any} [error] - An optional error object to log alongside the message.
 */
export const error = (msg: string, error?: any) => {
  console.log(chalk.red(msg), error ?? '');
}

/**
 * Logs an informational message in blue color.
 * 
 * @param {string} msg - The informational message to display.
 */
export const info = (msg: string) => {
  console.log(chalk.blue(msg));
}

/**
 * Logs a success message in green color.
 * 
 * @param {string} msg - The success message to display.
 */
export const success = (msg: string) => {
  console.log(chalk.green(msg));
}

/**
 * Returns a message formatted in bold text.
 * 
 * @param {string} msg - The message to format in bold.
 * @returns {string} The formatted message in bold.
 */
export const bold = (msg: string) => {
  return chalk.bold(msg);
}
