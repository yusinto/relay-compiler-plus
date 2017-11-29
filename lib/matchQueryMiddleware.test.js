'use strict';

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

jest.mock('body-parser', function () {
  return { json: global.td.function('mockBodyParser.json') };
});

describe('matchQueryMiddleware', function () {
  test('should map queryId to actual query', function () {
    var mockJsonParser = td.function('mockJsonParser');
    td.when(_bodyParser2.default.json()).thenReturn(mockJsonParser);
    var mockNext = td.function('mockNext');
    var mockRequest = { body: { queryId: 'animalMd5' } };
    var mockQueryMapJson = { animalMd5: 'query { animal }' };
    var captor = td.matchers.captor();

    var matchQueryMiddleware = require('./matchQueryMiddleware').default;
    var middleware = matchQueryMiddleware(mockQueryMapJson);
    middleware(mockRequest, null, mockNext);

    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    var queryMapFunction = captor.values[0];
    queryMapFunction();

    expect(mockRequest.body.query).toEqual('query { animal }');
    td.verify(mockNext());
  });
});