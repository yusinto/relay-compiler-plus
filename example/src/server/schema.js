import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema, introspectSchema} from 'graphql-tools';
import fetch from 'node-fetch'
import {importSchema} from 'graphql-import';
import rcpSchema from './rcpSchema';
// import {createApolloFetch} from 'apollo-fetch';

const remoteTypeDefs = importSchema('./remote.schema.graphql');

const fetcher = async ({query, variables, operationName, context}) => {
  const body = JSON.stringify({query, variables, operationName});
  console.log(`body looks like: ${body}`);
  const fetchResult = await fetch('https://graphql.myshopify.com/api/graphql', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-shopify-storefront-access-token': '078bc5caa0ddebfa89cccb4a1baa1f5c',
    },
    body,
  });
  return fetchResult.json();
};

// const fetcher = createApolloFetch('https://graphql.myshopify.com/api/graphql');

const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: remoteTypeDefs}),
  fetcher,
});
const result = mergeSchemas({
  schemas: [rcpSchema, remoteSchema],
});

export default result;



