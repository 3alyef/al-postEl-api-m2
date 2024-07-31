import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};

export default config;

/** @type {import('ts-jest').JestConfigWithTsJest} 
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};*/


