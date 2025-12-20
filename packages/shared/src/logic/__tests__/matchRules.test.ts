import { describe, it, expect } from 'vitest';
import { differentIdsViolation } from '../matchRules.js';

describe('differentIdsViolation', () => {
  it('returns null for different ids', () => {
    expect(differentIdsViolation('a', 'b')).toBe(null);
  });

  it('fails when empty', () => {
    expect(differentIdsViolation('', 'b')).toMatchObject({ code: 'PROFILE_ID_EMPTY' });
    expect(differentIdsViolation('a', '')).toMatchObject({ code: 'PROFILE_ID_EMPTY' });
  });

  it('fails when same', () => {
    expect(differentIdsViolation('x', 'x')).toMatchObject({ code: 'PROFILE_ID_SAME' });
  });
});
