import type {Config} from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: "node",
    verbose: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    // // Indicates which provider should be used to instrument code for coverage
    // coverageProvider: "babel",
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },

    maxConcurrency: 5,
};
export default config;