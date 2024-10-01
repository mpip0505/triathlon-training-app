/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'babel-jest', // Use babel-jest for transpiling TypeScript files
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'], // Look for test files with .test.ts/.test.tsx/.test.js/.test.jsx
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Make sure Jest uses your TypeScript configuration
    },
  },

};