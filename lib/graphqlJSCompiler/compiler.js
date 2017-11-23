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
  // const schemaPath = './example/src/server/schema.js';
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

    console.log('Compiling schema.graphql');
    var transpiled = './compiled';
    var schema = require(transpiled).default;
    fs.writeFileSync(path.join(__dirname, './schema.graphql'), graphqlUtils.printSchema(schema));

    console.log('Cleaning up');
    fs.unlinkSync(path.join(__dirname, './compiled.js'));
    return console.log('Success compiled graphql-js.');
  };

  console.log('Transpiling graphql-js with webpack');
  webpackConfig.entry.push(schemaPath);
  webpack([webpackConfig], webpackCallback);
};