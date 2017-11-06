import Express from 'express';
import Webpack from 'webpack';
import bodyParser from 'body-parser';
import WebpackConfig from '../../webpack.config.dev';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebPackHotMiddleware from 'webpack-hot-middleware';
import expressGraphl from 'express-graphql';
import graphqlSchema from './schema';

const PORT = 3000;
const app = Express();
const jsonParser = bodyParser.json();

// create a webpack instance from our dev config
const webpackCompiler = Webpack(WebpackConfig);

// Use webpack dev middleware to bundle our universal on the fly and serve it
// on publicPath. Turn off verbose webpack output in our server console
// by setting noInfo: true
app.use(WebpackDevMiddleware(webpackCompiler, {
  publicPath: WebpackConfig.output.publicPath,
  noInfo: true
}));

// instruct our webpack instance to use webpack hot middleware
app.use(WebPackHotMiddleware(webpackCompiler));

// graphql
app.use('/graphql', jsonParser,
  (req, res, next) => {
    if (req.body.queryId) {
      console.log(`Mapping queryId: ${req.body.queryId}`);
      // TODO: lookup queryId and insert it into the post body for expressGraphql to process
      req.body.query = `
      query client_index_Query {
        root {
            animal
            ...app_root
          }
        }
        
        fragment app_root on Root {
          animal
          human
        }
      `
    }

    next();
  },
  expressGraphl({
    schema: graphqlSchema,
    graphiql: true,
  }))
;

app.use((req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});