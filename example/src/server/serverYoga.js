import { GraphQLServer } from 'graphql-yoga'
import schema from './createSchema';

const server = new GraphQLServer({schema});
server.start(() => console.log('Server is running on localhost:4000'))