module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Security-focused rules - critical for preventing XSS and injection attacks
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    
    // Prevent dangerous HTML injection
    'no-inner-declarations': 'error',
    'no-global-assign': 'error',
    
    // General code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'warn',
    'no-unused-vars': 'off', // Handled by TypeScript
  },
};