import { describe, expect, it } from 'vitest';
import { differentIdsHttpError, differentIdsViolation } from '../matchRules.js';

describe('differentIdsViolation', () => {
  it('returns null for different ids', () => {
    expect(differentIdsViolation('a', 'b')).toBeNull();
  });

  it('fails when any id is empty', () => {
    expect(differentIdsViolation('', 'b')).toEqual({
      code: 'PROFILE_ID_EMPTY',
      message: 'fromProfileId and toProfileId are required',
    });

    expect(differentIdsViolation('a', '')).toEqual({
      code: 'PROFILE_ID_EMPTY',
      message: 'fromProfileId and toProfileId are required',
    });
  });

  it('fails when ids are the same', () => {
    expect(differentIdsViolation('x', 'x')).toEqual({
      code: 'PROFILE_ID_SAME',
      message: 'fromProfileId must differ from toProfileId',
    });
  });
});

describe('differentIdsHttpError', () => {
  it('returns null when ids are valid', () => {
    expect(differentIdsHttpError('a', 'b')).toBeNull();
  });

  it('maps violation to http 409 with code + message', () => {
    expect(differentIdsHttpError('', 'b')).toEqual({
      status: 409,
      body: {
        code: 'PROFILE_ID_EMPTY',
        message: 'fromProfileId and toProfileId are required',
      },
    });

    expect(differentIdsHttpError('x', 'x')).toEqual({
      status: 409,
      body: {
        code: 'PROFILE_ID_SAME',
        message: 'fromProfileId must differ from toProfileId',
      },
    });
  });
});
