"use strict";

var nodeExternals = require('webpack-node-externals');

var path = require('path');

module.exports = {
  entry: [],
  externals: [nodeExternals()],
  // ignore all modules in node_modules folder
  output: {
    path: path.resolve('.'),
    filename: 'graphql-js-transpiled.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        babelrc: false,
        presets: ['@babel/preset-flow', ['@babel/preset-env', {
          modules: 'commonjs'
        }]],
        plugins: ['@babel/plugin-transform-flow-strip-types', '@babel/plugin-transform-async-to-generator']
      }
    }]
  }
};