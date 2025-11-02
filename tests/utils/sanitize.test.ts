import { describe, it, expect } from 'vitest';
import { sanitizeFileName } from '../../src/utils/sanitize';

describe('sanitizeFileName', () => {
  it('should remove special characters and spaces', () => {
    const result = sanitizeFileName('Hello World!!!');
    expect(result).toBe('hello-world');
  });

  it('should handle empty strings', () => {
    const result = sanitizeFileName('');
    expect(result).toBe('');
  });
});
