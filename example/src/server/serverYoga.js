import {GraphQLServer} from 'graphql-yoga';
import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import rcpSchema from './rcpSchema';
import {importSchema} from 'graphql-import';
import fetch from 'node-fetch';
import fs from 'fs'
import {createApolloFetch} from 'apollo-fetch';

const remoteTypeDefs = importSchema('./remote.schema.graphql');
// const fetcher = createApolloFetch({uri: 'https://api.github.com/graphql'});
// fetcher.use(({request, options}, next) => {
//   options.headers = {
//     Authorization: 'Bearer a7738ea4a1e2f38096325598ce8c5b25e0414f7d',
//   };
//   next();
// });

const fetcher = async props => {
  const { query, variables, operationName } = props;
  const fetchResult = await fetch(`https://api.github.com`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: 'Bearer a7738ea4a1e2f38096325598ce8c5b25e0414f7d',
    },
    body: JSON.stringify({ query, variables, operationName }),
  });
  return fetchResult.json();
};


const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: remoteTypeDefs}),
  fetcher,
});

const server = new GraphQLServer({schema: remoteSchema});
server.start(() => console.log('Server is running on localhost:4000'))