/** @type {import('@stryker-mutator/api/core').StrykerOptions} */
module.exports = {
  mutate: ['packages/shared/src/logic/**/*.ts'],
  testRunner: 'command',
  commandRunner: {
    command: 'pnpm vitest run packages/shared/src/logic/**/*.test.ts',
  },
  reporters: ['progress', 'clear-text', 'html'],
  coverageAnalysis: 'off',
  tempDirName: '.stryker-tmp',
};
