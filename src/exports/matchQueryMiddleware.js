import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

export default function matchQuery(queryMapJson) {
  return (req, res, next) => {
    return jsonParser(req, res, () => {
      const queryId = req.body.queryId;
      if (queryId) {
        console.log(`Mapping queryId: ${queryId}`);
        const query = queryMapJson.find(q => q.id === queryId);
        if (query) {
          console.log(`Yayy! Found persisted query ${queryId}`);
          req.body.query = query.text;
        } else {
          console.error(`ERROR matching queryId: ${queryId}`);
        }
      }
      next();
    });
  };
};