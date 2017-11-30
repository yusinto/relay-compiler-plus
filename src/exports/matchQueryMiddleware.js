import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

const log = (message, debug) => {
  if (debug) console.log(message);
};

export default function matchQueryMiddleware(queryMapJson, debug = false) {
  return (req, res, next) => {
    return jsonParser(req, res, () => {
      const {queryId} = req.body;
      if (queryId) {
        log(`Mapping queryId: ${queryId}`, debug);
        const query = queryMapJson[queryId];
        if (query) {
          log(`Yayy! Found persisted query ${queryId}`, debug);
          req.body.query = query;
        } else {
          throw new Error(`matchQueryMiddleware: can't find queryId: ${queryId}`);
        }
      }
      next();
    });
  };
}