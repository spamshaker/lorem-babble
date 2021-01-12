import base from './packages/jest.config';

export default {
  ...base,
  projects: ['<rootDir>/packages/*/jest.config.ts'],
  coverageDirectory: '<rootDir>/coverage/',
  roots: ['<rootDir>']
};
