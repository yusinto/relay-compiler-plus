import {GraphQLServer} from 'graphql-yoga'
import schema from './schema';
import bodyParser from 'body-parser';

const server = new GraphQLServer({schema});

server.express.use(bodyParser.json());
server.express.post('/', (req, res, next) => {
  console.log(`=====> in rcp example, query body looks like: ${JSON.stringify(req.body.query)}`);
  next();
});

server.start(() => console.log('Server is running on localhost:4000'));