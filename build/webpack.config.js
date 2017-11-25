import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const compiler = 'main.js';

export default {
  entry: ['babel-polyfill', `./src/compiler/${compiler}`],
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
          presets: ['flow', ['env', {modules: 'commonjs'}], 'stage-0'],
          plugins: ['transform-flow-strip-types', 'transform-async-to-generator'],
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
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        join_vars: true,
        if_return: true,
      },
    }),
  ],
};
