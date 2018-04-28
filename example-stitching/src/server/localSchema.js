import {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList} from 'graphql';

const Place = new GraphQLObjectType({
  name: 'Place',
  fields: {
    id: {type: GraphQLString},
    name: {type: GraphQLString},
  }
});

const wendyPlaces = [
  {id: 'sugar-factory', name: 'Sugar Factory'},
  {id: 'nutdo', name: 'Nutdo'},
  {id: 'goodbye-carbs', name: 'Goodbye Carbs'},
];
const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: new GraphQLObjectType({
        name: 'User',
        fields: {
          email: {
            type: GraphQLString,
            resolve: () => 'wendy@gmail.com',
          },
          name: {
            type: GraphQLString,
            resolve: () => 'Wendy Ang',
          },
          favouritePlaces: {
            type: new GraphQLList(Place),
            resolve: () => wendyPlaces,
          }
        }
      }),
      resolve: () => true,
    },
    place: {
      type: Place,
    },
  },
});

const schema = new GraphQLSchema({query});
export default schema;