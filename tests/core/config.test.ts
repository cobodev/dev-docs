import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

vi.mock('fs');
vi.mock('path');
vi.mock('dotenv');

describe('config module', () => {
  const mockReadFileSync = vi.fn();
  const mockExistsSync = vi.fn();
  const mockResolve = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    (fs.readFileSync as unknown as typeof mockReadFileSync) = mockReadFileSync;
    (fs.existsSync as unknown as typeof mockExistsSync) = mockExistsSync;
    (path.resolve as unknown as typeof mockResolve) = mockResolve;
    mockResolve.mockImplementation((p) => p);
    (dotenv.config as any).mockReturnValue({});
  });

  it('should load config with defaults when files exist', async () => {
    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue(
      JSON.stringify({
        defaultAuthor: 'Jane Doe',
        params: { fixed: ['date', 'year'] },
        availableModules: ['issues', 'features'],
      }),
    );

    const { config } = await import('../../src/core/config');

    expect(dotenv.config).toHaveBeenCalledWith({
      path: expect.stringContaining('/defaults/default.env'),
    });

    expect(config.defaultAuthor).toBe('Jane Doe');
    expect(config.fixedParams).toEqual(['date', 'year']);
    expect(config.availableModules).toEqual(['issues', 'features']);
    expect(config.version).toBe('1.0.0');
  });

  it('should handle missing config.json gracefully', async () => {
    mockExistsSync.mockReturnValue(false);

    const { config } = await import('../../src/core/config');

    expect(config.defaultAuthor).toBe('');
    expect(config.fixedParams).toEqual([]);
    expect(config.availableModules).toEqual([]);
  });

  it('should respect environment variables if defined', async () => {
    process.env.VERSION = '9.9.9';
    process.env.CURRENT_PATH = '/tmp';
    process.env.DEFAULTS_PATH = 'defaults';

    mockExistsSync.mockReturnValue(true);
    mockReadFileSync.mockReturnValue('{}');

    const { config } = await import('../../src/core/config');

    expect(config.version).toBe('9.9.9');
    expect(config.currentPath).toBe('/tmp');
    expect(config.defaultsPath).toContain('defaults');

    // Cleanup env vars
    delete process.env.VERSION;
    delete process.env.CURRENT_PATH;
    delete process.env.DEFAULTS_PATH;
  });
});
