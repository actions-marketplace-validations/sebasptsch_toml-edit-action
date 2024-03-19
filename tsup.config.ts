import { defineConfig } from 'tsup'

export default defineConfig(({ watch }) => ({
    entry: ["src/index.ts"],
    splitting: true,
    format: ['esm', 'cjs'],
    dts: false,
    clean: true,
    bundle: true,
    sourcemap: false,
    minify: false,
    onSuccess: watch
        ? "node --enable-source-maps dist/index.js --inspect"
        : undefined,
}))