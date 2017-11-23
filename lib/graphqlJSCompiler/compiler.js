'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('util');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utilities = require('graphql/utilities');

var _utilities2 = _interopRequireDefault(_utilities);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('./webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var webpackAsync = (0, _util.promisify)(_webpack2.default);

var printErrors = function printErrors(summary, errors) {
  console.log(summary);
  errors.forEach(function (err) {
    console.log(err.message || err);
  });
};

exports.default = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(schemaPath) {
    var webpackResult, transpiled, schema, outputDest;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('Transpiling graphql-js with webpack');

            _webpack4.default.entry.push(schemaPath);
            _context.next = 4;
            return webpackAsync([_webpack4.default]);

          case 4:
            webpackResult = _context.sent;

            console.log('webpack result: ' + JSON.stringify(webpackResult));
            // const stats = rawStats.toJson();
            //
            // if (err) {
            //   return printErrors('Failed to compile.', [err]);
            // }
            //
            // if (stats.errors.length) {
            //   return printErrors('Failed to compile.', stats.errors);
            // }

            transpiled = _path2.default.resolve(process.cwd(), './compiled.js');

            console.log('Compiling schema.graphql from ' + transpiled);
            schema = require(transpiled).default;

            console.log('schema looks like:' + JSON.stringify(schema));
            outputDest = _path2.default.resolve(process.cwd(), './schema.graphql');

            console.log('writing to ' + outputDest);

            _fs2.default.writeFileSync(outputDest, _utilities2.default.printSchema(schema));
            console.log('Cleaning up');
            _fs2.default.unlinkSync(transpiled);
            console.log('Successfully compiled graphql-js.');

            return _context.abrupt('return', outputDest);

          case 17:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();