'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var path = require('path');
var graphqlUtils = require('graphql/utilities');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

exports.default = function (schemaPath) {
  var printErrors = function printErrors(summary, errors) {
    console.log(summary);
    errors.forEach(function (err) {
      console.log(err.message || err);
    });
  };
  var webpackCallback = function webpackCallback(err, rawStats) {
    var stats = rawStats.toJson();
    if (err) return printErrors('Failed to compile.', [err]);
    if (stats.errors.length) return printErrors('Failed to compile.', stats.errors);

    var transpiled = path.resolve(process.cwd(), './compiled.js');
    console.log('Compiling schema.graphql from ' + transpiled);

    var schema = require(transpiled).default;
    console.log('schema looks like:' + JSON.stringify(schema));
    var outputDest = path.resolve(process.cwd(), './schema.graphql');
    console.log('writing to ' + outputDest);

    fs.writeFileSync(outputDest, graphqlUtils.printSchema(schema));

    console.log('Cleaning up');
    fs.unlinkSync(transpiled);
    return console.log('Successfully compiled graphql-js.');
  };

  console.log('Transpiling graphql-js with webpack');
  webpackConfig.entry.push(schemaPath);
  webpack([webpackConfig], webpackCallback);
};