import {defineConfig} from 'tsup';
export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm', 'iife'],
    dts: true,
    outDir: 'dist',
    name: 'base62',
    splitting: false,
    sourcemap: true,
    clean: true,
    target: 'es6',
    minify: true,
});