# relay-compiler-plus-stitching-example
Example project using relay-compiler-plus and schema stitching.

## Quickstart

```
yarn

npm start
```

Browse to http://localhost:3000 and you should see a list of places with details coming from prisma.

You can even use graphiql to query the remote schema! http://localhost:3000/graphql

and do this:

```graphql
{
    businesses {
        name
        email
    }
} 

```