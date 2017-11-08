# relay-compiler-plus
This is work in progress. Please check back soon!

Custom relay compiler which supports persisted queries

## Installation

npm i -g relay-compiler-plus

## Quickstart
cd <YOUR_PROJECT_DIR>

relay-compiler-plus --schema <SCHEMA_FILE_PATH> --src <SRC_DIR_PATH>

You'll see generated root *.graphql.js files now contain ids and null text.

A query map file is also generated under <SRC_DIR_PATH>/queryMap.json.
This file can be consumed by the server to map query ids to operation.text.

Check the [example](https://github.com/yusinto/relay-compiler-plus/tree/master/example)
for a fully working demo.

