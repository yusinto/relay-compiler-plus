'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matchQuery;

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = _bodyParser2.default.json();

function matchQuery(queryMapJson) {
  return function (req, res, next) {
    return jsonParser(req, res, function () {
      var queryId = req.body.queryId;
      if (queryId) {
        console.log('Mapping queryId: ' + queryId);
        var query = queryMapJson.find(function (q) {
          return q.id === queryId;
        });
        if (query) {
          console.log('Yayy! Found persisted query ' + queryId);
          req.body.query = query.text;
        } else {
          console.error('ERROR matching queryId: ' + queryId);
        }
      }
      next();
    });
  };
};