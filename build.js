import contentMinifierPlugin from './contentMinifierPlugin.js';
import { build } from 'esbuild';
build({
	entryPoints: ['./src/index.js'],
	bundle: true,
	platform: 'neutral',
	format: 'esm',
	target: ['es2024'],
	plugins: [contentMinifierPlugin()],
	minify: true,
	splitting: false,
	treeShaking: true,
	outdir: './dist',
	keepNames: true,
	external: ['cloudflare:workers'],
	legalComments: 'none',
	treeShaking: true,
});
