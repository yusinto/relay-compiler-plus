// Create the client and server production builds
import webpack from 'webpack';
import webpackConfigSchema from './webpack.config';

const printErrors = (summary, errors) => {
  console.log(summary);
  errors.forEach(err => {
    console.log(err.message || err);
  });
};

const getWebpackError = (err, rawStats) => {
  const stats = rawStats.toJson();

  if (err) {
    return printErrors('Failed to compile.', [err]);
  }

  if (stats.errors.length) {
    return printErrors('Failed to compile.', stats.errors);
  }

  return console.log('Compiled successfully.');
};

console.log('Building custom relay compiler...');

webpack([webpackConfigSchema], getWebpackError);
