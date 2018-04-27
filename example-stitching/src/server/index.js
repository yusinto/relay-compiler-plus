import {GraphQLServer} from 'graphql-yoga'
import schema from './mergedSchema';
import Webpack from 'webpack';
import WebpackConfig from '../../webpack.config.dev';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebPackHotMiddleware from 'webpack-hot-middleware';
import queryMapJson from '../queryMap.json';
import {matchQueryMiddleware} from 'relay-compiler-plus';

const webpackCompiler = Webpack(WebpackConfig);
const server = new GraphQLServer({schema});
server.express.use(WebpackDevMiddleware(webpackCompiler, {
  publicPath: WebpackConfig.output.publicPath,
  noInfo: true
}));
server.express.use(WebPackHotMiddleware(webpackCompiler));
server.express.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Create relay modern app</title>
                      </head>
                      <body>
                        <div id="reactDiv" />
                        <script type="application/javascript" src="/dist/bundle.js"></script>
                      </body>
                    </html>`;

  res.end(html);
});
server.express.post(server.options.endpoint, matchQueryMiddleware(queryMapJson));
const options = {
  port: 8000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground',
}
server.start(options, ({port}) => console.log(`Yoga is running on localhost:${port}`));