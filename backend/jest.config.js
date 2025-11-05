module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'service/**/*.js',
    'controller/**/*.js',
    'auth/**/*.js',
    'utils/**/*.js',
    'middleware/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/scripts/**'
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 25,
      lines: 20,
      statements: 20
    }
  },
  coverageReporters: ['text', 'lcov', 'clover', 'json'],
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
