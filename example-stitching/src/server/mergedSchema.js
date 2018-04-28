import {mergeSchemas, makeRemoteExecutableSchema, makeExecutableSchema} from 'graphql-tools';
import {importSchema} from 'graphql-import';
import {HttpLink} from 'apollo-link-http';
import fetch from 'node-fetch';
import localSchema from './localSchema';

const uri = 'https://eu1.prisma.sh/public-nickelwarrior-830/wendarie-prisma/dev';
const httpLink = new HttpLink({uri, fetch});

const remoteSchema = makeRemoteExecutableSchema({
  schema: makeExecutableSchema({typeDefs: importSchema('./remote.schema.graphql')}),
  link: httpLink,
});

const linkTypeDefs = `
  extend type Place {
    business: Business
  }
`;
const result = mergeSchemas({
  schemas: [localSchema, remoteSchema, linkTypeDefs],
  resolvers: {
    Place: {
      business: {
        fragment: `fragment PlaceFragment on Place { id }`,
        resolve: (place, args, context, info) =>
          info.mergeInfo.delegateToSchema({
            schema: remoteSchema,
            operation: 'query',
            fieldName: 'business',
            args: {
              where: {
                publicId: place.id,
              },
            },
            context,
            info,
          }),
      }
    }
  }
});

export default result;
