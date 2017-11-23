const fs = require('fs');
const path = require('path');
const graphqlUtils = require('graphql/utilities');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

export default schemaPath => {
  const printErrors = (summary, errors) => {
    console.log(summary);
    errors.forEach(err => {
      console.log(err.message || err);
    });
  };
  const webpackCallback = (err, rawStats) => {
    const stats = rawStats.toJson();
    if (err) return printErrors('Failed to compile.', [err]);
    if (stats.errors.length) return printErrors('Failed to compile.', stats.errors);

    const transpiled = path.resolve(process.cwd(), './compiled.js');
    console.log(`Compiling schema.graphql from ${transpiled}`);

    const schema = require(transpiled).default;
    console.log(`schema looks like:${JSON.stringify(schema)}`);
    const outputDest = path.resolve(process.cwd(), './schema.graphql');
    console.log(`writing to ${outputDest}`);

    fs.writeFileSync(
      outputDest,
      graphqlUtils.printSchema(schema)
    );

    console.log('Cleaning up');
    fs.unlinkSync(transpiled);
    return console.log('Successfully compiled graphql-js.');
  };

  console.log('Transpiling graphql-js with webpack');
  webpackConfig.entry.push(schemaPath);
  webpack([webpackConfig], webpackCallback);
};