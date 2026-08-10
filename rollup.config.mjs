import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'builtin-modules';
import {createRequire} from 'module';

// Node cannot import JSON from an ES module without an import assertion, so read
// package.json through a CommonJS require instead.
const pkg = createRequire(import.meta.url)('./package.json');

export default {
  // Exclude Node.js built-in modules (fs, path, crypto, etc.) from the bundle.
  external: builtins,

  // Entry point.
  input: './src/index.ts',

  plugins: [
    // Compile TypeScript and generate declaration files.
    typescript({
      // The plugin's own default is ["*.ts+(|x)", "**/*.ts+(|x)", ...], and
      // picomatch 2.3.2 no longer matches that empty-alternative extglob against
      // a plain ".ts" path. Every source file then fails the filter, and the
      // transform hook returns the TypeScript unchanged for Rollup to choke on.
      // Spell the patterns out so the match does not depend on extglob support.
      include: ['**/*.ts', '**/*.tsx'],
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
