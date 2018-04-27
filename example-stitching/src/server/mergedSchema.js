import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import fetch from 'node-fetch';
import localSchema from './localSchema';

const uri = 'https://api.yelp.com/v3/graphql';

const httpLink = new HttpLink({uri, fetch});
const link = setContext(() => ({
  headers: {
    'Authorization': `Bearer ivBFA35PyGDQS0Drwb3R6h-7zwbtuykyqplRxtgzfeYGqvxu3rzeRDOcmp-YKgQXmom8bphj0iNJwgdhTFOsNI4GeUbtOnOxs-OB1gOebY7bHujJlN0KRwsjE53iWnYx`,
  },
})).concat(httpLink);

const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: importSchema('./remote.schema.graphql')}),
  link,
});
const result = mergeSchemas({
  schemas: [localSchema, remoteSchema],
});

export default result;
