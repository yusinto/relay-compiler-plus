jest.mock('./utils', () => ({md5: global.td.function('mockMd5')}));

import {md5} from './utils';
import {queryMap, persistQuery} from './persistQuery';

describe('persistQuery', () => {
  const animalQuery = 'query { animal }';
  const humanQuery = 'query { human }';
  
  beforeEach(() => {
    delete queryMap.animalMd5;
    delete queryMap.humanMd5;

    td.reset();
  });

  test('should hash and store query correctly', async () => {
    td.when(md5(animalQuery)).thenReturn('animalMd5');

    const queryId = await persistQuery(animalQuery);
    expect(queryId).toEqual('animalMd5');
    expect(queryMap[queryId]).toEqual(animalQuery);
  });

  test('should hash and store all queries correctly', async () => {
    td.when(md5(animalQuery)).thenReturn('animalMd5');
    td.when(md5(humanQuery)).thenReturn('humanMd5');

    const queryId1 = await persistQuery(animalQuery);
    const queryId2 = await persistQuery(humanQuery);

    expect(queryId1).toEqual('animalMd5');
    expect(queryMap[queryId1]).toEqual(animalQuery);
    expect(queryId2).toEqual('humanMd5');
    expect(queryMap[queryId2]).toEqual(humanQuery);
  });
});