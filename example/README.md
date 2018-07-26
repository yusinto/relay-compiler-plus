# relay-compiler-plus-example
Example project using relay-compiler-plus to generate relay persisted queries.

## Quickstart

```
yarn

# to compile from schema.js
yarn rcp-js

# to compile from schema.js using a custom webpack config
yarn rcp-js-custom

# to compile from schema.graphql or schema.json
yarn rcp

yarn start
```

Browse to http://localhost:3000, under dev tools network tab you should be able
to see graphql requests sent has a queryId and variables object and nothing
else.

On the server, you should be able to see console output of the server
mapping the queryId to the actual queries.

Have fun!