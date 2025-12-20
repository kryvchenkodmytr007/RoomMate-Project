export type RuleViolation = {
  code: string;
  message: string;
};

/**
 * Pure domain rules (no DB, no frameworks). Easy to unit-test.
 */
export function budgetRangeViolation(budgetMin: number, budgetMax: number): RuleViolation | null {
  if (!Number.isFinite(budgetMin) || !Number.isFinite(budgetMax)) {
    return { code: 'BUDGET_NOT_NUMBER', message: 'budgetMin and budgetMax must be numbers' };
  }
  if (!Number.isInteger(budgetMin) || !Number.isInteger(budgetMax)) {
    return { code: 'BUDGET_NOT_INT', message: 'budgetMin and budgetMax must be integers' };
  }
  if (budgetMin < 0 || budgetMax < 0) {
    return { code: 'BUDGET_NEGATIVE', message: 'budgetMin and budgetMax must be >= 0' };
  }
  if (budgetMin > budgetMax) {
    return { code: 'BUDGET_RANGE', message: 'budgetMin must be <= budgetMax' };
  }
  return null;
}

/**
 * Convenience helper: returns a { status, body } pair ready for express.
 */
export function budgetRangeHttpError(
  budgetMin: number,
  budgetMax: number,
): { status: 400; body: { message: string; code: string } } | null {
  const v = budgetRangeViolation(budgetMin, budgetMax);
  if (!v) return null;
  return { status: 400, body: { message: v.message, code: v.code } };
}
