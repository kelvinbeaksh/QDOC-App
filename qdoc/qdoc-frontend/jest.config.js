module.exports = {
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 89,
      functions: 90,
      lines: 90
    }
  },
  coverageDirectory: './jest_report/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/src/assets/',
    '<rootDir>/src/config/',
    '<rootDir>/src/constants/',
    '<rootDir>/src/typings/',
    '<rootDir>/src/types/',
    '<rootDir>/src/types/.*.d.ts',
    '<rootDir>/src/react-app-env.d.ts',
    '<rootDir>/src/*/columns.tsx',
    '<rootDir>/src/screens/qr-events/utils/QrImageDownloader.ts'
  ],
  testEnvironment: "jsdom",
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/__mocks__',
    '<rootDir>/__tests__/test-helper',
    '<rootDir>/node_modules/',
    '<rootDir>/src/assets/',
    '<rootDir>/src/typings/',
    'jest_report/'
  ],
  reporters: ['default'],
  watchPathIgnorePatterns: ['<rootDir>/jest.json'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!antd|@ant-design|rc-.+?|@babel/runtime|d3-timer|array-move).+(js|jsx)$'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js'
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
};
