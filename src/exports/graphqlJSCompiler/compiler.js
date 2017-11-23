import {promisify} from 'util';
import fs from 'fs';
import path from 'path';
import graphqlUtils from 'graphql/utilities';
import webpack from 'webpack';
import webpackConfig from './webpack.config';

const webpackAsync = promisify(webpack);

const printErrors = (summary, errors) => {
  console.log(summary);
  errors.forEach(err => {
    console.log(err.message || err);
  });
};

export default async (schemaPath) => {
  console.log('Transpiling graphql-js with webpack');

  webpackConfig.entry.push(schemaPath);
  const webpackResult = await webpackAsync([webpackConfig]);
  console.log(`webpack result: ${JSON.stringify(webpackResult)}`);
  // const stats = rawStats.toJson();
  //
  // if (err) {
  //   return printErrors('Failed to compile.', [err]);
  // }
  //
  // if (stats.errors.length) {
  //   return printErrors('Failed to compile.', stats.errors);
  // }

  const transpiled = path.resolve(process.cwd(), './compiled.js');
  console.log(`Compiling schema.graphql from ${transpiled}`);
  const schema = require(transpiled).default;
  console.log(`schema looks like:${JSON.stringify(schema)}`);
  const outputDest = path.resolve(process.cwd(), './schema.graphql');
  console.log(`writing to ${outputDest}`);

  fs.writeFileSync(outputDest, graphqlUtils.printSchema(schema));
  console.log('Cleaning up');
  fs.unlinkSync(transpiled);
  console.log('Successfully compiled graphql-js.');

  return outputDest;
};