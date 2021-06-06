import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import del from 'del';

const conf = require('./package.json');
const version = conf.version;
const pixi = conf.devDependencies['pixi.js'].replace('^', '');

const banner = [
	'/*!',
	` * @tawaship/pixi-animate-core - v${version}`,
	' * ',
	` * @require pixi.js v${pixi}`,
	' * @author tawaship (makazu.mori@gmail.com)',
	' * @license MIT',
	' */',
	''
].join('\n');

export default (async () => {
	if (process.env.PROD) {
		await del(['./docs', './types', './dist']);
	}
	
	return [
		{
			input: 'src/index.ts',
			output: [
				{
					banner,
					file: 'dist/pixi-animate-core.cjs.js',
					format: 'cjs',
					sourcemap: true
				},
				{
					banner,
					file: 'dist/pixi-animate-core.esm.js',
					format: 'esm',
					sourcemap: true
				}
			],
			external: ['pixi.js', '@tawaship/createjs-exporter'],
			watch: {
				clearScreen: false
			},
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript()
			]
		}
	]
})();