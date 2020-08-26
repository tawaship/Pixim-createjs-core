import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
//import buble from '@rollup/plugin-buble';
//import { terser } from 'rollup-plugin-terser';
import del from 'del';

const conf = require('./package.json');
const version = conf.version;
const pixi = conf.dependencies['pixi.js'].replace('^', '');

const banner = [
	'/*!',
	` * @tawaship/pixi-createjs-core.js - v${version}`,
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
					file: 'dist/pixi-createjs-core.cjs.js',
					format: 'cjs',
					sourcemap: true
				},
				{
					banner,
					file: 'dist/pixi-createjs-core.esm.js',
					format: 'esm',
					sourcemap: true
				}
			],
			external: ['pixi.js'],
			watch: {
				clearScreen: false
			},
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript()
			]
		}/*,
		{
			input: 'src/index.ts',
			output: [
				{
					banner,
					file: 'dist/pixi-createjs-core.js',
					format: 'iife',
					name: 'pixi-createjs-core',
					sourcemap: true,
					extend: true,
					globals: {
						'pixi.js': 'PIXI'
					}
				}
			],
			external: ['pixi.js'],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript(),
				buble(),
				terser({
					compress: {
						//drop_console: true
						pure_funcs: ['console.log']
					},
					mangle: false,
					output: {
						beautify: true,
						braces: true
					}
				})
			]
		},
		{
			input: 'src/index.ts',
			output: [
				{
					banner,
					file: 'dist/pixi-createjs-core.min.js',
					format: 'iife',
					name: 'pixi-createjs-core',
					extend: true,
					globals: {
						'pixi.js': 'PIXI'
					},
					compact: true
				}
			],
			external: ['pixi.js'],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript(),
				buble(),
				terser({
					compress: {
						//drop_console: true,
						pure_funcs: ['console.log']
					}
				})
			]
		}*/
	]
})();