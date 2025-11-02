import { describe, it, expect, vi, beforeEach } from 'vitest';
import { input } from '@inquirer/prompts';
import { askParameters } from '../../src/core/prompts';

vi.mock('@inquirer/prompts', () => ({
  input: vi.fn(),
}));

describe('askParameters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call input for each parameter and return the answers', async () => {
    (input as unknown as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce('John Doe')
      .mockResolvedValueOnce('42');

    const result = await askParameters(['name', 'age']);

    expect(input).toHaveBeenCalledTimes(2);
    expect(input).toHaveBeenNthCalledWith(1, { message: 'name:', default: '' });
    expect(input).toHaveBeenNthCalledWith(2, { message: 'age:', default: '' });
    expect(result).toEqual({ name: 'John Doe', age: '42' });
  });

  it('should return an empty object when no parameters are provided', async () => {
    const result = await askParameters([]);
    expect(result).toEqual({});
    expect(input).not.toHaveBeenCalled();
  });
});
