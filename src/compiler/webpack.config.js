import nodeExternals from 'webpack-node-externals';
import path from 'path';
import webpack from 'webpack';

export default {
  entry: ['babel-polyfill'],
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()], // ignore all modules in node_modules folder
  output: {
    path: path.resolve('./'),
    filename: 'compiled.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        // We must exclude any import of universal/redux/store
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
  ],
};
