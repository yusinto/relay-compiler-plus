import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

export default function matchQueryMiddleware(queryMapJson) {
  return (req, res, next) => {
    return jsonParser(req, res, () => {
      const {queryId} = req.body;
      if (queryId) {
        console.log(`Mapping queryId: ${queryId}`);
        const query = queryMapJson[queryId];
        if (query) {
          console.log(`Yayy! Found persisted query ${queryId}`);
          req.body.query = query;
        } else {
          console.error(`ERROR: can't find queryId: ${queryId}`);
        }
      }
      next();
    });
  };
}