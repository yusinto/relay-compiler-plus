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
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(schemaPath, srcDir) {
    var rawStats, stats, transpiled, schema, outputDest;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('transpiling graphql-js with webpack');
            _webpack4.default.entry.push(schemaPath);

            rawStats = void 0;
            _context.prev = 3;
            _context.next = 6;
            return webpackAsync([_webpack4.default]);

          case 6:
            rawStats = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](3);
            return _context.abrupt('return', printErrors('Failed to compile.', [_context.t0]));

          case 12:
            stats = rawStats.toJson();

            if (!stats.errors.length) {
              _context.next = 15;
              break;
            }

            return _context.abrupt('return', printErrors('Failed to compile.', stats.errors));

          case 15:
            transpiled = _path2.default.resolve(_webpack4.default.output.path, _webpack4.default.output.filename);
            schema = require(transpiled).default;
            outputDest = _path2.default.resolve(srcDir, './schema.graphql');


            _fs2.default.writeFileSync(outputDest, (0, _utilities.printSchema)(schema));
            _fs2.default.unlinkSync(transpiled);

            console.log('Successfully compiled graphql-js.');
            return _context.abrupt('return', outputDest);

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[3, 9]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();