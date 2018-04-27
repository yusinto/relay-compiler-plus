import {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID} from 'graphql';

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
              console.log('Invoking animal');
              return 'loui';
            }
          },
          human: {
            type: GraphQLString,
            resolve: () => {
              console.log('Invoking human');
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