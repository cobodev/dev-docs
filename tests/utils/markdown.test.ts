import { describe, it, beforeEach, expect, vi } from 'vitest';
import {
  getUserParameters,
  getAutoParameters,
  replaceUserParameters,
  replaceAutoParameters,
  getAutoAnswers,
} from '../../src/utils/markdown';
import { logger } from '../../src/core/logger';
import * as fsUtils from '../../src/utils/fs';

// Mock dependencies
vi.mock('../../src/core/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

vi.mock('../../src/utils/fs', () => ({
  getContentFromFile: vi.fn(),
  writeContentToFile: vi.fn(),
}));

describe('parameters utils', () => {
  const mockFilePath = '/fake/path/template.md';
  const mockContent = `
    # Example
    {{title}}
    {{description}}
    {{@date}}
    {{@year}}
  `;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should extract user parameters correctly', () => {
    vi.spyOn(fsUtils, 'getContentFromFile').mockReturnValue(mockContent);

    const result = getUserParameters(mockFilePath);
    expect(result).toContain('title');
    expect(result).toContain('description');
    expect(result).not.toContain('@date');
  });

  it('should return empty array and log error if file read fails (user)', () => {
    vi.spyOn(fsUtils, 'getContentFromFile').mockImplementation(() => {
      throw new Error('File not found');
    });

    const result = getUserParameters(mockFilePath);
    expect(result).toEqual([]);
    expect(logger.error).toHaveBeenCalledWith(
      'Error getting parameters from file.',
      expect.any(Error),
    );
  });

  it('should extract auto parameters correctly', () => {
    vi.spyOn(fsUtils, 'getContentFromFile').mockReturnValue(mockContent);

    const result = getAutoParameters(mockFilePath);
    expect(result).toContain('date');
    expect(result).toContain('year');
    expect(result).not.toContain('title');
  });

  it('should return empty array and log error if file read fails (auto)', () => {
    vi.spyOn(fsUtils, 'getContentFromFile').mockImplementation(() => {
      throw new Error('Read error');
    });

    const result = getAutoParameters(mockFilePath);
    expect(result).toEqual([]);
    expect(logger.error).toHaveBeenCalledWith(
      'Error getting parameters from file.',
      expect.any(Error),
    );
  });

  it('should replace user parameters correctly in file content', () => {
    const content = 'Hello {{name}}, today is {{day}}!';
    vi.spyOn(fsUtils, 'getContentFromFile').mockReturnValue(content);

    replaceUserParameters(mockFilePath, { name: 'Alice', day: 'Monday' });

    const expectedContent = 'Hello Alice, today is Monday!';
    expect(fsUtils.writeContentToFile).toHaveBeenCalledWith(mockFilePath, expectedContent);
  });

  it('should replace auto parameters correctly in file content', () => {
    const content = 'Generated on {{@date}} ({{@year}})';
    vi.spyOn(fsUtils, 'getContentFromFile').mockReturnValue(content);

    replaceAutoParameters(mockFilePath, { date: '2025-10-21', year: '2025' });

    const expectedContent = 'Generated on 2025-10-21 (2025)';
    expect(fsUtils.writeContentToFile).toHaveBeenCalledWith(mockFilePath, expectedContent);
  });

  it('should throw error and log when file read fails during replace', () => {
    vi.spyOn(fsUtils, 'getContentFromFile').mockImplementation(() => {
      throw new Error('Read fail');
    });

    expect(() => replaceUserParameters(mockFilePath, { name: 'Test' })).toThrow();
    expect(logger.error).toHaveBeenCalledWith('Error replacing in file:', expect.any(Error));
  });

  it('should generate auto answers for date and year', () => {
    const params = ['date', 'year'];
    const result = getAutoAnswers(params);

    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.year).toMatch(/^\d{4}$/);
  });

  it('should ignore unrecognized parameters', () => {
    const params = ['foo', 'bar'];
    const result = getAutoAnswers(params);

    expect(result).toEqual({});
  });
});
