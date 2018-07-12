import Express from 'express';
import Webpack from 'webpack';
import WebpackConfig from '../../webpack.config.dev';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebPackHotMiddleware from 'webpack-hot-middleware';
import expressGraphl from 'express-graphql';
import mergedSchema from './mergedSchema';
import queryMapJson from '../queryMap.json';
import {matchQueryMiddleware} from 'relay-compiler-plus';

const PORT = 3000;
const app = Express();

const webpackCompiler = Webpack(WebpackConfig);
app.use(WebpackDevMiddleware(webpackCompiler, {
  publicPath: WebpackConfig.output.publicPath,
  noInfo: true
}));
app.use(WebPackHotMiddleware(webpackCompiler));

app.use('/graphql',
  matchQueryMiddleware(queryMapJson),
  expressGraphl({
    schema: mergedSchema,
    graphiql: true,
  }));

app.use((req, res) => {
  const html = `<!DOCTYPE html>
                    <html>
                      <head>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Relay compiler plus stitching example</title>
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