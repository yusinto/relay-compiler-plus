import {GraphQLObjectType, GraphQLSchema, GraphQLString} from 'graphql';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    root: {
      type: new GraphQLObjectType({
        name: 'Root',
        fields: {
          animal: {
            type: GraphQLString,
            resolve: () => 'loui',
          },
          human: {
            type: GraphQLString,
            resolve: () => 'wendy',
          },
        }
      }),
      resolve: () => true,
    },
  },
});

const schema = new GraphQLSchema({query});
export default schema;