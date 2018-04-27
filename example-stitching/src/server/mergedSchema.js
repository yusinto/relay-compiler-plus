import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import {HttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import fetch from 'node-fetch';
import localSchema from './localSchema';

const uri = 'https://eu1.prisma.sh/yusinto-ngadiman-fe83e4/demo/dev';
const httpLink = new HttpLink({uri, fetch});

const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: importSchema('./remote.schema.graphql')}),
  link: httpLink,
});
const result = mergeSchemas({
  schemas: [localSchema, remoteSchema],
});

export default result;
