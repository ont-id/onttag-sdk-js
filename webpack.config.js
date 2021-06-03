// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');
var nodeExternals = require('webpack-node-externals');

let common = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      crypto: false,
      stream: false,
    },
  },

};
// output: {
//   libraryTarget: 'umd',
//     filename: 'index.js',
//     path: path.resolve(__dirname, 'lib'),
//     globalObject: 'this',
// },
module.exports = [
  Object.assign({}, common, {
    target: 'web',
    entry: ['babel-polyfill', './src/index.ts'],
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'browser.js',
      libraryTarget: 'var',
      library: 'VC' // This is the var name in browser
    },
  }),
  Object.assign({}, common, {
    target: 'node',
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    externals: [nodeExternals()]
  })
]
