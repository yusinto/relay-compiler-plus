"use strict";

describe('matchQueryMiddleware', function () {
  var originalConsoleLog = console.log;
  console.log = td.function('mockConsoleLog');
  var mockRequest = {
    body: {
      queryId: 'animalMd5'
    }
  };
  var mockQueryMapJson = {
    animalMd5: 'query { animal }'
  };
  var mockJsonParser = td.function('mockJsonParser');
  var mockNext = td.function('mockNext');
  var matchQueryMiddleware;
  var captor;
  beforeEach(function () {
    jest.doMock('body-parser', function () {
      return {
        json: function json() {
          return mockJsonParser;
        }
      };
    });
    captor = td.matchers.captor();
    matchQueryMiddleware = require('./matchQueryMiddleware').default;
  });
  afterEach(function () {
    td.reset();
    jest.resetAllMocks();
    jest.resetModules();
  });
  afterAll(function () {
    console.log = originalConsoleLog;
  });
  test('should map queryId to actual query', function () {
    var middleware = matchQueryMiddleware(mockQueryMapJson);
    middleware(mockRequest, null, mockNext);
    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    var queryMapFunction = captor.values[0];
    queryMapFunction();
    expect(mockRequest.body.query).toEqual('query { animal }');
    td.verify(mockNext());
    td.verify(console.log(td.matchers.anything()), {
      times: 0
    });
  });
  test('should log when debug is true', function () {
    var middleware = matchQueryMiddleware(mockQueryMapJson, true);
    middleware(mockRequest, null, mockNext);
    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    var queryMapFunction = captor.values[0];
    queryMapFunction();
    expect(mockRequest.body.query).toEqual('query { animal }');
    td.verify(mockNext());
    td.verify(console.log(td.matchers.anything()), {
      times: 2
    });
  });
  test('should throw error when queryId is not found', function () {
    var middleware = matchQueryMiddleware(mockQueryMapJson, true);
    mockRequest.body.queryId = 'does-not-exist';
    middleware(mockRequest, null, mockNext);
    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    var queryMapFunction = captor.values[0];
    expect(queryMapFunction).toThrow('matchQueryMiddleware: can\'t find queryId: does-not-exist');
  });
});