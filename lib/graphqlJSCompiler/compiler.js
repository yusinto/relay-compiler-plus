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

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

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
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(schemaPath, srcDir, customWebpackConfig) {
    var webpackConfig, rawStats, stats, transpiled, schema, outputDest;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('transpiling graphql-js with webpack');

            webpackConfig = void 0;

            if (customWebpackConfig) {
              console.log('Using custom webpack config: ' + customWebpackConfig);
              webpackConfig = require(customWebpackConfig);
            } else {
              console.log('Using default webpack config');
              webpackConfig = require('./webpack.config');
              webpackConfig.entry.push(schemaPath);
            }

            rawStats = void 0;
            _context.prev = 4;
            _context.next = 7;
            return webpackAsync([webpackConfig]);

          case 7:
            rawStats = _context.sent;
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](4);
            return _context.abrupt('return', printErrors('Failed to compile.', [_context.t0]));

          case 13:
            stats = rawStats.toJson();

            if (!stats.errors.length) {
              _context.next = 16;
              break;
            }

            return _context.abrupt('return', printErrors('Failed to compile.', stats.errors));

          case 16:
            transpiled = _path2.default.resolve(webpackConfig.output.path, webpackConfig.output.filename);
            schema = require(transpiled).default;
            outputDest = _path2.default.resolve(srcDir, './schema.graphql');


            _fs2.default.writeFileSync(outputDest, (0, _utilities.printSchema)(schema));
            _fs2.default.unlinkSync(transpiled);

            console.log('Successfully compiled graphql-js.');
            return _context.abrupt('return', outputDest);

          case 23:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[4, 10]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();