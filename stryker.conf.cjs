/** @type {import('@stryker-mutator/api/core').StrykerOptions} */
module.exports = {
  mutate: [
    'packages/shared/src/logic/*.ts',
    '!packages/shared/src/logic/__tests__/**',
    '!**/*.test.ts',
    '!packages/shared/src/db/**',
    '!packages/shared/src/httpErrors.ts',
  ],
  testRunner: 'command',
  commandRunner: {
    command: 'pnpm -C packages/shared test:unit',
  },
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'off',
};
