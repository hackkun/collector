import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/main.ts',
  output: {
    format: 'es',
    file: './dist/main.js'
  },
  plugins: [
    commonjs({}),
    typescript({
      exclude: 'node_modules/**'
    }),
    terser()
  ]
}
