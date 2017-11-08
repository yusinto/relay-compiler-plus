# relay-compiler-plus

[![npm version](https://img.shields.io/npm/v/relay-compiler-plus.svg?style=flat-square)](https://www.npmjs.com/package/relay-compiler-plus) [![npm downloads](https://img.shields.io/npm/dm/relay-compiler-plus.svg?style=flat-square)](https://www.npmjs.com/package/relay-compiler-plus) [![npm](https://img.shields.io/npm/dt/relay-compiler-plus.svg?style=flat-square)](https://www.npmjs.com/package/relay-compiler-plus) [![npm](https://img.shields.io/npm/l/relay-compiler-plus.svg?style=flat-square)](https://www.npmjs.com/package/relay-compiler-plus)

> **Custom relay compiler which supports persisted queries** :bowtie:

## Installation

npm i -g relay-compiler-plus

## Usage
At your project dir

```
relay-compiler-plus --schema <SCHEMA_FILE_PATH> --src <SRC_DIR_PATH>
```

You'll see generated root *.graphql.js files now contain ids and null text.

A query map file is also generated under <SRC_DIR_PATH>/queryMap.json.
This file can be consumed by the server to map query ids to operation.text.

## Example
Check the [example](https://github.com/yusinto/relay-compiler-plus/tree/master/example)
for a fully working demo.

