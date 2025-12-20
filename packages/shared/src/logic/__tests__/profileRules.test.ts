import { describe, it, expect } from 'vitest';
import { budgetRangeViolation } from '../profileRules.js';

describe('budgetRangeViolation', () => {
  it('returns null for valid range', () => {
    expect(budgetRangeViolation(100, 200)).toBe(null);
  });

  it('fails when not numbers', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(budgetRangeViolation('1' as any, 2)).toMatchObject({ code: 'BUDGET_NOT_NUMBER' });
  });

  it('fails when not integers', () => {
    expect(budgetRangeViolation(1.1, 2)).toMatchObject({ code: 'BUDGET_NOT_INT' });
  });

  it('fails when negative', () => {
    expect(budgetRangeViolation(-1, 2)).toMatchObject({ code: 'BUDGET_NEGATIVE' });
  });

  it('fails when min > max', () => {
    expect(budgetRangeViolation(300, 200)).toMatchObject({ code: 'BUDGET_RANGE' });
  });
});
