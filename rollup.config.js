import * as path from 'path'
import postcss from 'rollup-plugin-postcss'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const packageJson = require('./package.json')

export default [
  {
    input: 'index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: false,
      },
    ],
    // external: [
    //   ...Object.keys(packageJson.dependencies || {}),
    //   ...Object.keys(packageJson.peerDependencies || {}),
    // ].filter(Boolean),
    // external: [/node_modules/],
    external: [new RegExp(path.join(process.cwd(), 'node_modules'))],
    plugins: [
      postcss({
        minimize: true,
        modules: true,
      }),
      commonjs(),
      resolve(),
      typescript({
        tsconfig: './tsconfig.build.json',
      }),
    ],
  },
]
