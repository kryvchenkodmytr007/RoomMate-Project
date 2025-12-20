export type HttpError = { status: number; body: { message: string } };

export function budgetRangeHttpError(budgetMin: number, budgetMax: number): HttpError | null {
  if (Number.isFinite(budgetMin) && Number.isFinite(budgetMax) && budgetMin <= budgetMax)
    return null;
  return { status: 400, body: { message: 'budgetMin must be <= budgetMax' } };
}

export function differentIdsHttpError(
  fromProfileId: string,
  toProfileId: string,
): HttpError | null {
  if (fromProfileId && toProfileId && fromProfileId !== toProfileId) return null;
  return { status: 400, body: { message: 'fromProfileId must differ from toProfileId' } };
}
