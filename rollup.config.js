import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'builtin-modules'
import pkg from './package.json';

export default {
  // Exclude Node.js built-in modules (fs, path, crypto, etc.) from the bundle.
  external: builtins,

  // Entry point.
  input: './src/index.ts',

  plugins: [
    // Compile TypeScript and generate declaration files.
    typescript({
      tsconfigDefaults: { compilerOptions: {} },
      tsconfig: "tsconfig.json",
      tsconfigOverride: { compilerOptions: {} },
      useTsconfigDeclarationDir: true
    }),

    // Minify the output.
    terser(),

    // Allow importing JSON files.
    json(),

    // Convert CommonJS modules to ES modules.
    commonjs(),

    // Resolve node_modules dependencies.
    resolve({
      mainFields: ['module', 'main'],
    })
  ],

  output: [
    // ESM build (for bundlers).
    {
      format: 'esm',
      file: pkg.module
    },
    // CommonJS build (for Node.js).
    {
      format: 'cjs',
      file: pkg.main
    }
  ],

  // Watch mode settings.
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
}
