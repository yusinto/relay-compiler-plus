"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util = require("util");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _utilities = require("graphql/utilities");

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var webpackAsync = (0, _util.promisify)(_webpack.default);

var printErrors = function printErrors(summary, errors) {
  console.log(summary);
  errors.forEach(function (err) {
    console.log(err.message || err);
  });
};

var _default =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(schemaPath, srcDir, customWebpackConfig) {
    var webpackConfig, rawStats, stats, transpiled, schema, outputDest;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('transpiling graphql-js with webpack');

            if (customWebpackConfig) {
              console.log("Using custom webpack config: ".concat(customWebpackConfig));
              webpackConfig = require(customWebpackConfig); //eslint-disable-line import/no-dynamic-require
            } else {
              console.log('Using default webpack config');
              webpackConfig = require('./webpack.config'); //eslint-disable-line import/no-dynamic-require

              webpackConfig.entry.push(schemaPath);
            }

            _context.prev = 2;
            _context.next = 5;
            return webpackAsync([webpackConfig]);

          case 5:
            rawStats = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            return _context.abrupt("return", printErrors('Failed to compile.', [_context.t0]));

          case 11:
            stats = rawStats.toJson();

            if (!stats.errors.length) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", printErrors('Failed to compile.', stats.errors));

          case 14:
            transpiled = _path.default.resolve(webpackConfig.output.path, webpackConfig.output.filename);
            schema = require(transpiled).default; //eslint-disable-line import/no-dynamic-require

            outputDest = _path.default.resolve(srcDir, '../schema.graphql');

            _fs.default.writeFileSync(outputDest, (0, _utilities.printSchema)(schema));

            _fs.default.unlinkSync(transpiled);

            console.log('Successfully compiled graphql-js.');
            return _context.abrupt("return", outputDest);

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 8]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.default = _default;