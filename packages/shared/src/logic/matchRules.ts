import type { RuleViolation } from './profileRules.js';

export function differentIdsViolation(
  fromProfileId: string,
  toProfileId: string,
): RuleViolation | null {
  if (!fromProfileId || !toProfileId) {
    return { code: 'PROFILE_ID_EMPTY', message: 'fromProfileId and toProfileId are required' };
  }
  if (fromProfileId === toProfileId) {
    return { code: 'PROFILE_ID_SAME', message: 'fromProfileId must differ from toProfileId' };
  }
  return null;
}

export function differentIdsHttpError(
  fromProfileId: string,
  toProfileId: string,
): { status: 409; body: { message: string; code: string } } | null {
  const v = differentIdsViolation(fromProfileId, toProfileId);
  if (!v) return null;
  return { status: 409, body: { message: v.message, code: v.code } };
}
