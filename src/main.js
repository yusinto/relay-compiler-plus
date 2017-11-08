// @flow
import yargs from 'yargs';

import 'babel-polyfill';
import {promisify} from 'util';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import RelayCompiler from 'relay-compiler';
import {getFilepathsFromGlob, getRelayFileWriter, getSchema} from './ripped';

const {
  ConsoleReporter,
  Runner: CodegenRunner,
  FileIRParser: RelayJSModuleParser,
} = RelayCompiler;
const queryCache = [];
const writeFileAsync = promisify(fs.writeFile);

function md5(x: string): string {
  return crypto
    .createHash('md5')
    .update(x, 'utf8')
    .digest('hex');
}

function persistQuery(operationText: string): Promise<string> {
  return new Promise((resolve) => {
    const queryId = md5(operationText);
    queryCache.push({id: queryId, text: operationText});
    console.log(`mapped ${operationText} to ${queryId}`);
    resolve(queryId);
  });
}

async function run(options: { schema: string, src: string}) {
  const srcDir = path.resolve(process.cwd(), options.src);
  const schemaPath = path.resolve(process.cwd(), options.schema);
  console.log(`srcDir: ${srcDir}, schemaPath: ${schemaPath}`);

  const reporter = new ConsoleReporter({verbose: true});
  const parserConfigs = {
    default: {
      baseDir: srcDir,
      getFileFilter: RelayJSModuleParser.getFileFilter,
      getParser: RelayJSModuleParser.getParser,
      getSchema: () => getSchema(schemaPath),
      filepaths: getFilepathsFromGlob(srcDir, {
        extensions: ['js'],
        include: ['**'],
        exclude: [
          '**/node_modules/**',
          '**/__mocks__/**',
          '**/__tests__/**',
          '**/__generated__/**',
        ]
      }),
    },
  };
  const writerConfigs = {
    default: {
      getWriter: getRelayFileWriter(srcDir, persistQuery),
      isGeneratedFile: (filePath) =>
        filePath.endsWith('.js') && filePath.includes('__generated__'),
      parser: 'default',
    },
  };
  const codegenRunner = new CodegenRunner({
    reporter,
    parserConfigs,
    writerConfigs,
    onlyValidate: false,
  });

  // the real work is done here
  const result = await codegenRunner.compileAll();

  const queryCacheOutputFile = `${srcDir}/queryCache.json`;
  try {
    await writeFileAsync(queryCacheOutputFile, JSON.stringify(queryCache));
    console.log(`Query cache written to: ${queryCacheOutputFile}`);
  } catch (err) {
    if (err) {
      return console.log(err);
    }
  }

  console.log(`Done! ${result}`);
}

// Collect args
const argv = yargs
  .usage(`Usage: $0 --schema <path-to-schema> --src <path-to-src-dir>`)
  .options({
    schema: {
      describe: 'Path to schema.graphql or schema.json',
      demandOption: true,
      type: 'string',
    },
    src: {
      describe: 'Root directory of application code',
      demandOption: true,
      type: 'string',
    },
  })
  .help().argv;

(async function () {
  console.log(`Starting relay compilation`);
  try {
    await run(argv);
  } catch (err) {
    console.log(`error: ${err}`);
    process.exit(1);
  }
})();