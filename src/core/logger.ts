import chalk from "chalk";

/**
 * A simple logger utility for colored console output.
 */
export const logger = {
  /**
   * Logs an error message in red color.
   * 
   * @param {string} msg - The error message to display.
   * @param {any} [error] - An optional error object to log alongside the message.
   */
  error: (msg: string, error?: any) => {
    console.log(chalk.red(msg), error ?? '');
  },
  
  /**
   * Logs an informational message in blue color.
   * 
   * @param {string} msg - The informational message to display.
   */
  info: (msg: string) => {
    console.log(chalk.blue(msg));
  },
  
  /**
   * Logs a success message in green color.
   * 
   * @param {string} msg - The success message to display.
   */
  success: (msg: string) => {
    console.log(chalk.green(msg));
  },

  /**
   * Logs a title.
   * 
   * @param {string} msg - The title message to display.
   */
  title: (msg: string) => {
    console.log(chalk.bold.cyan(`\n=== ${msg.toUpperCase()} ===`));
  },
  
  /**
   * Returns a message formatted in bold text.
   * 
   * @param {string} msg - The message to format in bold.
   * @returns {string} The formatted message in bold.
   */
   bold: (msg: string) => {
    return chalk.bold(msg);
  }
}