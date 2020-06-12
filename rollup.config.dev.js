import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/main.ts',
  output: {
    format: 'umd',
    name: 'Collector',
    file: './dist/main.js'
  },
  plugins: [
    commonjs({}),
    typescript({
      exclude: 'node_modules/**'
    })
  ]
}
