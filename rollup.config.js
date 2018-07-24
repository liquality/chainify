import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

import pkg from './package.json'

const dependencies = Object.keys(pkg.dependencies)

export default [
  {
    input: 'src/index.js',
    external: dependencies,
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      json(),
      resolve(),
      commonjs({
        namedExports: {
          'node_modules/lodash/lodash.js': [
            'find',
            'isArray',
            'isBoolean',
            'isFunction',
            'isNumber',
            'has'
          ]
        }
      }),
      babel({
        exclude: [
          'node_modules/**'
        ]
      })
    ]
  }
]
