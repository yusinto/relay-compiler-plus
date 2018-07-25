"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = matchQueryMiddleware;

var _bodyParser = _interopRequireDefault(require("body-parser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsonParser = _bodyParser.default.json();

var log = function log(message, debug) {
  if (debug) console.log(message);
};

function matchQueryMiddleware(queryMapJson) {
  var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return function (req, res, next) {
    return jsonParser(req, res, function () {
      var queryId = req.body.queryId;

      if (queryId) {
        log("Mapping queryId: ".concat(queryId), debug);
        var query = queryMapJson[queryId];

        if (query) {
          log("Yayy! Found persisted query ".concat(queryId), debug);
          req.body.query = query;
        } else {
          throw new Error("matchQueryMiddleware: can't find queryId: ".concat(queryId));
        }
      }

      next();
    });
  };
}