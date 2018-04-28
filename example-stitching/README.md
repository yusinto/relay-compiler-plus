# relay-compiler-plus-stitching-example
Example project using relay-compiler-plus and schema stitching.

## Quickstart

```
yarn

npm start
```

Browse to http://localhost:3000, under dev tools network tab you should be able
to see graphql requests sent has a queryId and variables object and nothing
else.

On the server, you should be able to see console output of the server
mapping the queryId to the actual queries.

Have fun!