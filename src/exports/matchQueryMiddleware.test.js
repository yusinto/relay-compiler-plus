
describe('matchQueryMiddleware', () => {
  const originalConsoleLog = console.log;
  console.log = td.function('mockConsoleLog');

  const mockRequest = {body: {queryId: 'animalMd5'}};
  const mockQueryMapJson = {animalMd5: 'query { animal }'};
  const mockJsonParser = td.function('mockJsonParser');

  const mockNext = td.function('mockNext');
  let matchQueryMiddleware;
  let captor;

  beforeEach(() => {
    jest.doMock('body-parser', () => ({json: () => mockJsonParser}));
    captor = td.matchers.captor();
    matchQueryMiddleware = require('./matchQueryMiddleware').default;
  });

  afterEach(() => {
    td.reset();
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
  });

  test('should map queryId to actual query', () => {
    const middleware = matchQueryMiddleware(mockQueryMapJson);
    middleware(mockRequest, null, mockNext);

    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    const queryMapFunction = captor.values[0];
    queryMapFunction();

    expect(mockRequest.body.query).toEqual('query { animal }');
    td.verify(mockNext());
    td.verify(console.log(td.matchers.anything()), {times: 0});
  });

  test('should log when debug is true', () => {
    const middleware = matchQueryMiddleware(mockQueryMapJson, true);
    middleware(mockRequest, null, mockNext);

    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    const queryMapFunction = captor.values[0];
    queryMapFunction();

    expect(mockRequest.body.query).toEqual('query { animal }');
    td.verify(mockNext());
    td.verify(console.log(td.matchers.anything()), {times: 2});
  });

  test('should throw error when queryId is not found', () => {
    const middleware = matchQueryMiddleware(mockQueryMapJson, true);
    mockRequest.body.queryId = 'does-not-exist';
    middleware(mockRequest, null, mockNext);

    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    const queryMapFunction = captor.values[0];
    expect(queryMapFunction).toThrow('matchQueryMiddleware: can\'t find queryId: does-not-exist');
  });
});
