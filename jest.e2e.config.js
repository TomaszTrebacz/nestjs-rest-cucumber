const baseConfig = require('./jest.config');
require('tsconfig-paths/register');

module.exports = {
  ...baseConfig,
  testEnvironment: './src/test-utils/environment-e2e.ts',
  testRegex: '.e2e.test.ts$',
  testTimeout: 15000,
  roots: ['<rootDir>/src'],
};
