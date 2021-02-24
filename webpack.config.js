const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const TerserPlugin = require('terser-webpack-plugin')
let nodeModules = {}
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => nodeModules[mod] = 'commonjs ' + mod)

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            'presets': [
              ['@babel/preset-env', {
                'targets': {
                  'node': '14.15.4'
                }
              }],
              ['minify', {
                'mangle': true
              }]
            ],
            'plugins': [
              ['module-resolver', {
                'root': ['./src'],
                'alias': {
                  'account': './src/account',
                  'api': './src/api',
                  'block': './src/block',
                  'config': './src/config',
                  'transaction': './src/transaction',
                  'util': './src/util'
                }
              }]
            ]
          }
        }
      ]
    }]
  },
  externals: nodeModules
}