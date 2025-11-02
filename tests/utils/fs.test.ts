import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../../src/core/logger';
import {
  isEmptyPath,
  pathExists,
  copyFile,
  createFile,
  createDirectory,
  getContentFromFile,
  writeContentToFile,
  getBlockFromFile,
} from '../../src/utils/fs';

vi.mock('node:fs');
vi.mock('node:path', async () => {
  const actual = await vi.importActual<typeof path>('node:path');
  return {
    ...actual,
    join: vi.fn((...args) => actual.join(...args)),
  };
});
vi.mock('../../src/core/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('fs-utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isEmptyPath', () => {
    it('returns true if directory is empty', () => {
      vi.mocked(fs.readdirSync).mockReturnValueOnce([]);
      expect(isEmptyPath('dir')).toBe(true);
    });

    it('returns false if readdirSync throws', () => {
      vi.mocked(fs.readdirSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      expect(isEmptyPath('dir')).toBe(false);
    });
  });

  describe('pathExists', () => {
    it('returns true when path exists', () => {
      vi.mocked(fs.existsSync).mockReturnValueOnce(true);
      expect(pathExists('dir')).toBe(true);
    });

    it('returns false when path does not exist', () => {
      vi.mocked(fs.existsSync).mockReturnValueOnce(false);
      expect(pathExists('dir')).toBe(false);
    });

    it('returns false if existsSync throws', () => {
      vi.mocked(fs.existsSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      expect(pathExists('dir')).toBe(false);
    });
  });

  describe('copyFile', () => {
    it('calls fs.copyFileSync', () => {
      copyFile('src', 'dest');
      expect(fs.copyFileSync).toHaveBeenCalledWith('src', 'dest');
    });

    it('logs error if copy fails', () => {
      vi.mocked(fs.copyFileSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      copyFile('src', 'dest');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('createFile', () => {
    it('writes file with content', () => {
      createFile('file.txt', 'data');
      expect(fs.writeFileSync).toHaveBeenCalledWith('file.txt', 'data', 'utf-8');
    });

    it('logs and throws on error', () => {
      vi.mocked(fs.writeFileSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      expect(() => createFile('file.txt', 'data')).toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('createDirectory', () => {
    it('creates directory', () => {
      createDirectory('dir', 'name');
      expect(fs.mkdirSync).toHaveBeenCalled();
    });

    it('logs and throws on error', () => {
      vi.mocked(fs.mkdirSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      expect(() => createDirectory('dir', 'name')).toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getContentFromFile', () => {
    it('returns file content', () => {
      vi.mocked(fs.readFileSync).mockReturnValueOnce('hello world');
      expect(getContentFromFile('file.txt')).toBe('hello world');
    });

    it('logs error and returns empty string on fail', () => {
      vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      expect(() => getContentFromFile('file.txt')).toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('writeContentToFile', () => {
    it('writes file content', () => {
      writeContentToFile('file.txt', 'new data');
      expect(fs.writeFileSync).toHaveBeenCalledWith('file.txt', 'new data', 'utf-8');
    });

    it('logs and throws on error', () => {
      vi.mocked(fs.writeFileSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      expect(() => writeContentToFile('file.txt', 'new data')).toThrow();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getBlockFromFile', () => {
    it('returns content between START and END markers', () => {
      const fileContent = `
        <!-- TEST START -->
        hello world
        <!-- TEST END -->
      `;
      vi.mocked(fs.readFileSync).mockReturnValueOnce(fileContent);
      const block = getBlockFromFile('file.txt', 'test');
      expect(block).toBe('hello world');
    });

    it('returns empty string if no match', () => {
      vi.mocked(fs.readFileSync).mockReturnValueOnce('no markers');
      expect(getBlockFromFile('file.txt', 'test')).toBe('');
    });

    it('logs error and returns empty string on fail', () => {
      vi.mocked(fs.readFileSync).mockImplementationOnce(() => {
        throw new Error('fail');
      });
      const result = getBlockFromFile('file.txt', 'test');
      expect(result).toBe('');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
