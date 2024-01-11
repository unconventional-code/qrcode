module.exports = {
	coverageProvider: 'v8',
	testEnvironment: 'node',
	roots: ['<rootDir>/test'],
	testMatch: ['**/*.test.ts', '!**/*.*.test.ts','**/*.test.js','!**/*.*.test.js'],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	setupFiles: ['<rootDir>/test/setup.ts'],
	setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts']
};
