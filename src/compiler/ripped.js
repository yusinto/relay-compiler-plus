/**
 * The code in this file are ripped from:
 * relay-compiler/bin/RelayCompilerBin.js
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @providesModule RelayCompilerBin
 * @format
 */

import fs from 'fs';
import path from 'path';
import {
  buildASTSchema,
  buildClientSchema,
  parse,
  printSchema,
} from 'graphql';
import type {GraphQLSchema} from 'graphql';
import RelayCompiler from 'relay-compiler';
import formatGeneratedModule from './formatGeneratedModule';

const {
  FileWriter: RelayFileWriter,
  IRTransforms: RelayIRTransforms,
} = RelayCompiler;

const {
  codegenTransforms,
  fragmentTransforms,
  printTransforms,
  queryTransforms,
  schemaExtensions,
} = RelayIRTransforms;

export function getFilepathsFromGlob(baseDir,
                                     options: {
                                       extensions: Array<string>,
                                       include: Array<string>,
                                       exclude: Array<string>,
                                     },): Array<string> {
  const {extensions, include, exclude} = options;
  const patterns = include.map(inc => `${inc}/*.+(${extensions.join('|')})`);

  const glob = require('fast-glob');
  return glob.sync(patterns, {
    cwd: baseDir,
    bashNative: [],
    onlyFiles: true,
    ignore: exclude,
  });
}

// Note: this function has been modified from its original form.
// persistQuery param is added
export function getRelayFileWriter(baseDir: string, persistQuery: (operationText: string) => Promise<string>) {
  return (onlyValidate, schema, documents, baseDocuments) =>
    new RelayFileWriter({
      config: {
        baseDir,
        compilerTransforms: {
          codegenTransforms,
          fragmentTransforms,
          printTransforms,
          queryTransforms,
        },
        customScalars: {},
        formatModule: formatGeneratedModule,
        inputFieldWhiteListForFlow: [],
        schemaExtensions,
        useHaste: false,
        persistQuery,
      },
      onlyValidate,
      schema,
      baseDocuments,
      documents,
    });
}

export function getSchema(schemaPath: string): GraphQLSchema {
  try {
    let source = fs.readFileSync(schemaPath, 'utf8');
    if (path.extname(schemaPath) === '.json') {
      source = printSchema(buildClientSchema(JSON.parse(source).data));
    }
    source = `
  directive @include(if: Boolean) on FRAGMENT | FIELD
  directive @skip(if: Boolean) on FRAGMENT | FIELD

  ${source}
  `;
    return buildASTSchema(parse(source));
  } catch (error) {
    throw new Error(
      `
Error loading schema. Expected the schema to be a .graphql or a .json
file, describing your GraphQL server's API. Error detail:

${error.stack}
    `.trim(),
    );
  }
}