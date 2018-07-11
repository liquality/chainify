import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'

import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'

import pkg from './package.json'

const dependencies = Object.keys(pkg.dependencies)

export default [
  {
    input: 'src/index.js',
    output: [ {
      file: pkg.browser,
      format: 'umd',
      name: 'ChainAbstractionLibrary',
      sourcemap: false
    } ],
    plugins: [
      builtins(),
      resolve({
        module: true,
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        namedExports: {
          'node_modules/lodash/lodash.js': [
            'reduce',
            'find',
            'forEach',
            'includes',
            'endsWith',
            'assign',
            'defaults',
            'get',
            'has',
            'isArray',
            'isEmpty',
            'isPlainObject',
            'isString',
            'map',
            'mapKeys',
            'set'
          ],
          'node_modules/buffer/index.js': [
            'isBuffer'
          ],
          'node_modules/request-promise-native/lib/rp.js': [
            'request'
          ]
        },
        exclude: [
          'node_modules/rollup-plugin-node-globals/**'
        ]
      }),
      globals(),
      json(),
      babel({
        exclude: [
          'node_modules/**'
        ]
      }),
      (process.env.NODE_ENV === 'production' && terser())
    ]
  },
  {
    input: 'src/index.js',
    external: dependencies,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        intro: "var regeneratorRuntime = require('regenerator-runtime');\n"
      },
      {
        file: pkg.module,
        format: 'es',
        intro: "var regeneratorRuntime = require('regenerator-runtime');\n"
      }
    ],
    plugins: [
      json(),
      resolve({
        preferBuiltins: false
      }),
      babel({
        exclude: [
          'node_modules/**'
        ]
      })
    ]
  }
]
