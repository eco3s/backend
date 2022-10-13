import type { Config } from 'jest'

const config: Config = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.(t|j)s$':
			process.env.JEST_TS_TRANSFORMER ?? '@swc/jest',
	},
}

export default config
