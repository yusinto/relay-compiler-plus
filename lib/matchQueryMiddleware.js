'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matchQueryMiddleware;

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = _bodyParser2.default.json();

function matchQueryMiddleware(queryMapJson) {
  return function (req, res, next) {
    return jsonParser(req, res, function () {
      var queryId = req.body.queryId;

      if (queryId) {
        console.log('Mapping queryId: ' + queryId);
        var query = queryMapJson[queryId];
        if (query) {
          console.log('Yayy! Found persisted query ' + queryId);
          req.body.query = query;
        } else {
          console.error('ERROR: can\'t find queryId: ' + queryId);
        }
      }
      next();
    });
  };
}