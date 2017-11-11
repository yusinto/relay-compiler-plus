# relay-compiler-plus-example
Example project using relay-compiler-plus to generate relay persisted queries.

## Quickstart

```
yarn

npm run dev
```

Browse to http://localhost:3000, under dev tools network tab you should be able
to see graphql requests sent has a queryId and variables object and nothing
else.

On the server, you should be able to see console output of the server
mapping the queryId to the actual queries.

Have fun!