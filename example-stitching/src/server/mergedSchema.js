import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import fetch from 'node-fetch';
import localSchema from './localSchema';

const remoteTypeDefs = importSchema('./remote.schema.graphql');
const httpLink = new HttpLink({uri: 'https://api.yelp.com/v3/graphql', fetch});
const link = setContext(() => ({
  headers: {
    'Authorization': `Bearer ivBFA35PyGDQS0Drwb3R6h-7zwbtuykyqplRxtgzfeYGqvxu3rzeRDOcmp-YKgQXmom8bphj0iNJwgdhTFOsNI4GeUbtOnOxs-OB1gOebY7bHujJlN0KRwsjE53iWnYx`,
  }
})).concat(httpLink);

const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: remoteTypeDefs}),
  link,
});
const result = mergeSchemas({
  schemas: [localSchema, remoteSchema],
});

export default result;
