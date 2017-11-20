import webpack from 'webpack';
import webpackConfig from './webpack.config';
import fs from 'fs';
import path from 'path';
import {printSchema} from 'graphql/utilities';

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

console.log('Building graphql schema...');

export default (schemaPath, outDir) => {
  webpackConfig.entry.push(schemaPath);
  webpackConfig.output.path = path.resolve(process.cwd());
  webpack([webpackConfig], getWebpackError);
  const output = `${webpackConfig.output.path}/${webpackConfig.output.filename}`;
  console.log(output);
  console.log(`we are in ${path.resolve(process.cwd())}`);
  require(`${path.resolve(process.cwd())}/${webpackConfig.output.filename}`);

  console.log(`required successfully`);
  // fs.writeFileSync(
  //   path.join(outDir, './schema.graphql'),
  //   printSchema(schema.default)
  // );
};
