import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
    entry: ["src/index.ts"],
    splitting: true,
    format: ['esm'],
    dts: false,
    clean: true,
    bundle: true,
    sourcemap: true,
    minify: !watch,
    onSuccess: watch
        ? "node --enable-source-maps dist/index.js --inspect"
        : undefined,
}))