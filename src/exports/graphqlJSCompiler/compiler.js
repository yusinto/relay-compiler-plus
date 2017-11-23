const fs = require('fs');
const path = require('path');
const graphqlUtils = require('graphql/utilities');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

export default schemaPath => {
// const schemaPath = './example/src/server/schema.js';
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

    console.log('Compiling schema.graphql');
    const transpiled = './compiled';
    const schema = require(transpiled).default;
    fs.writeFileSync(
      path.join(__dirname, './schema.graphql'),
      graphqlUtils.printSchema(schema)
    );

    console.log('Cleaning up');
    fs.unlinkSync(path.join(__dirname, './compiled.js'));
    return console.log('Success compiled graphql-js.');
  };

  console.log('Transpiling graphql-js with webpack');
  webpackConfig.entry.push(schemaPath);
  webpack([webpackConfig], webpackCallback);
};