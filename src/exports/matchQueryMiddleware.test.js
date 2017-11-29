jest.mock('body-parser', () => ({json: global.td.function('mockBodyParser.json')}));

import bodyParser from 'body-parser';

describe('matchQueryMiddleware', () => {
  test('should map queryId to actual query', () => {
    const mockJsonParser = td.function('mockJsonParser');
    td.when(bodyParser.json()).thenReturn(mockJsonParser);
    const mockNext = td.function('mockNext');
    const mockRequest = {body: {queryId: 'animalMd5'}};
    const mockQueryMapJson = {animalMd5: 'query { animal }'};
    const captor = td.matchers.captor();

    const matchQueryMiddleware = require('./matchQueryMiddleware').default;
    const middleware = matchQueryMiddleware(mockQueryMapJson);
    middleware(mockRequest, null, mockNext);

    td.verify(mockJsonParser(td.matchers.anything(), td.matchers.anything(), captor.capture()));
    const queryMapFunction = captor.values[0];
    queryMapFunction();

    expect(mockRequest.body.query).toEqual('query { animal }');
    td.verify(mockNext());
  });
});