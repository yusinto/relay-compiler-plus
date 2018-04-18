import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import fetch from 'node-fetch'
import {importSchema} from 'graphql-import';
import rcpSchema from './rcpSchema';

const pokemonTypeDefs = importSchema('./pokemon.schema.graphql');

const fetcher = async ({query, variables, operationName, context}) => {
  const body = JSON.stringify({query, variables, operationName});
  const fetchResult = await fetch('https://api.graph.cool/simple/v1/Peerex/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body,
  });
  return fetchResult.json();
};

const pokemonSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: pokemonTypeDefs}),
  fetcher,
});
const result = mergeSchemas({
  schemas: [rcpSchema, pokemonSchema],
});

export default result;



