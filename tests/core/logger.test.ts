import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { logger } from '../../src/core/logger';
import chalk from 'chalk';

describe('logger', () => {
  const originalLog = console.log;

  beforeEach(() => {
    // Mock console.log to capture output
    console.log = vi.fn();
  });

  afterEach(() => {
    // Restore original console.log
    console.log = originalLog;
  });

  it('should log error messages in red', () => {
    const msg = 'Something went wrong';
    logger.error(msg);

    expect(console.log).toHaveBeenCalledWith(chalk.red(msg), '');
  });

  it('should log error messages with an additional error object', () => {
    const msg = 'Database error';
    const err = new Error('Connection lost');
    logger.error(msg, err);

    expect(console.log).toHaveBeenCalledWith(chalk.red(msg), err);
  });

  it('should log info messages in blue', () => {
    const msg = 'Starting process...';
    logger.info(msg);

    expect(console.log).toHaveBeenCalledWith(chalk.blue(msg));
  });

  it('should log success messages in green', () => {
    const msg = 'Operation completed!';
    logger.success(msg);

    expect(console.log).toHaveBeenCalledWith(chalk.green(msg));
  });

  it('should return a bold formatted message', () => {
    const msg = 'Important!';
    const result = logger.bold(msg);

    // check that chalk.bold was applied
    expect(result).toBe(chalk.bold(msg));
    // bold should not call console.log directly
    expect(console.log).not.toHaveBeenCalled();
  });
});
