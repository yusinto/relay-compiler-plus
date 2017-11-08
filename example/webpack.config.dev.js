var webpack = require('webpack');
var path = require('path');

const sourceFolder = path.resolve(__dirname, 'src');

module.exports = {
  devtool: 'source-map',
  // Add webpack-hot-middleware/client to our bundle so our universal subscribes to update notifications from the server
  entry: ['webpack-hot-middleware/client', path.join(__dirname, 'src/client/index')],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',

    // Add a publicPath property. This is the path referenced in the script tag in our html template to our bundle.js.
    // We need this to configure webpack-dev-middleware in server.js
    publicPath: '/dist/'
  },
  module: {
    // run eslint before compiling
    rules: [
      {
        test: /\.js$/,
        include: sourceFolder,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: 'react-hmre',
          cacheDirectory: true,
        },
      },
      {
        test: /\.json$/,
        include: sourceFolder,
        exclude: /node_modules/,
        loader: 'json-loader',
      }
    ]
  },

  // Enables hot module replacement in webpack
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
    }),
  ]
};