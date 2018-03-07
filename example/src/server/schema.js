import {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID} from 'graphql';
import Logger from '../universal/log';

const log = new Logger('schema');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    root: {
      type: new GraphQLObjectType({
        name: 'Root',
        fields: {
          id: {
            type: GraphQLID,
            resolve: () => true,
          },
          animal: {
            type: GraphQLString,
            resolve: () => {
              log.info('Invoking animal');
              return 'loui';
            }
          },
          human: {
            type: GraphQLString,
            resolve: () => {
              log.info('Invoking human');
              return 'wendy';
            }
          },
        }
      }),
      resolve: () => true,
    },
  },
});

const schema = new GraphQLSchema({query});
export default schema;