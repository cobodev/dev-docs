import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '../../src/core/logger';
import { exit } from '../../src/utils/process';

vi.mock('../../src/core/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('exit', () => {
  const mockExit = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error(`process.exit: ${code}`);
  }) as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs an error message and exits with code 0', async () => {
    try {
      await exit();
    } catch (err: any) {
      expect(err.message).toBe('process.exit: 0');
    }

    expect(logger.error).toHaveBeenCalledWith('Project setup cancelled.');
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
