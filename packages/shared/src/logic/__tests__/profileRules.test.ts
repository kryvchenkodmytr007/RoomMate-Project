import { describe, expect, it } from 'vitest';
import { budgetRangeHttpError, budgetRangeViolation } from '../profileRules.js';

describe('budgetRangeViolation', () => {
  it('returns null for valid range (including borders)', () => {
    expect(budgetRangeViolation(100, 200)).toBeNull();
    expect(budgetRangeViolation(0, 0)).toBeNull();
    expect(budgetRangeViolation(0, 1)).toBeNull();
    expect(budgetRangeViolation(10, 10)).toBeNull();
  });

  it('fails when not numbers', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(budgetRangeViolation('1' as any, 2)).toEqual({
      code: 'BUDGET_NOT_NUMBER',
      message: 'budgetMin and budgetMax must be numbers',
    });
  });

  it('fails when not integers', () => {
    expect(budgetRangeViolation(1.1, 2)).toEqual({
      code: 'BUDGET_NOT_INT',
      message: 'budgetMin and budgetMax must be integers',
    });
  });

  it('fails when either value is negative (min or max)', () => {
    expect(budgetRangeViolation(-1, 2)).toEqual({
      code: 'BUDGET_NEGATIVE',
      message: 'budgetMin and budgetMax must be >= 0',
    });

    expect(budgetRangeViolation(1, -1)).toEqual({
      code: 'BUDGET_NEGATIVE',
      message: 'budgetMin and budgetMax must be >= 0',
    });
  });

  it('fails when min > max', () => {
    expect(budgetRangeViolation(300, 200)).toEqual({
      code: 'BUDGET_RANGE',
      message: 'budgetMin must be <= budgetMax',
    });
  });
});

describe('budgetRangeHttpError', () => {
  it('returns null for valid range', () => {
    expect(budgetRangeHttpError(0, 1)).toBeNull();
  });

  it('maps violation to http 400 with code + message', () => {
    expect(budgetRangeHttpError(1, -1)).toEqual({
      status: 400,
      body: {
        code: 'BUDGET_NEGATIVE',
        message: 'budgetMin and budgetMax must be >= 0',
      },
    });
  });
});
