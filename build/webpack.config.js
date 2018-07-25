import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const compiler = 'main.js';

export default {
  entry: ['@babel/polyfill', `./src/compiler/${compiler}`],
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals(), 'relay-compiler-plus/graphqlJSCompiler'], // ignore all modules in node_modules folder
  output: {
    path: path.resolve('./bin'),
    filename: 'relay-compiler-plus',
    pathinfo: true,
    library: 'RelayCompilerPlus',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: false,
          presets: ['@babel/preset-flow', ['@babel/preset-env', {modules: 'commonjs'}]],
          plugins: ['@babel/plugin-transform-flow-strip-types', '@babel/plugin-transform-async-to-generator'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new UglifyJsPlugin(),
  ],
};
