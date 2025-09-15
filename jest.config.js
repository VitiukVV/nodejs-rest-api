module.exports = {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testMatch: ["**/tests/**/*.test.js"],
    collectCoverageFrom: ["controllers/**/*.js", "!controllers/**/*.test.js"],
    coverageDirectory: "coverage",
    coverageReporters: ["text", "lcov", "html"],
};
