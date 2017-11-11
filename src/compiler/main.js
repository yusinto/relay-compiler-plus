import yargs from 'yargs';

import 'babel-polyfill';
import {promisify} from 'util';
import path from 'path';
import fs from 'fs';
import RelayCompiler from 'relay-compiler';
import {getFilepathsFromGlob, getRelayFileWriter, getSchema} from './ripped';
import {md5, clean} from "./utils";

const {
  ConsoleReporter,
  Runner: CodegenRunner,
  FileIRParser: RelayJSModuleParser,
} = RelayCompiler;
const queryCache = [];
const writeFileAsync = promisify(fs.writeFile);

function persistQuery(operationText: string): Promise<string> {
  return new Promise((resolve) => {
    const queryId = md5(operationText);
    queryCache.push({id: queryId, text: operationText});
    resolve(queryId);
  });
}

/*
* Most of the code in this run method are ripped from:
* relay-compiler/bin/RelayCompilerBin.js
*/
async function run(options: { schema: string, src: string}) {
  const srcDir = path.resolve(process.cwd(), options.src);
  const schemaPath = path.resolve(process.cwd(), options.schema);
  const force = options.force;
  console.log(`schema: ${schemaPath}`);
  console.log(`src: ${srcDir}`);
  console.log(`force: ${force}`);

  if (force) {
    clean(srcDir);
  } else {
    console.log('Not cleaning.');
  }

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

  let result = '';
  try {
    // the real work is done here
    result = await codegenRunner.compileAll();
  } catch(err) {
    console.log(`Error codegenRunner.compileAll(): ${err}`);
    throw err;
  }

  const queryCacheOutputFile = `${srcDir}/queryMap.json`;
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
  .usage(`Usage: $0 --schema <schemaPath> --src <srcDir> -f`)
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
    force: {
      describe: 'Recursively delete all *.graphql.js files in src folder before compilation',
      demandOption: false,
      type: 'boolean'
    }
  })
  .alias('f', 'force')
  .help().argv;

(async function () {
  console.log(`Welcome to relay-compiler-plus. Compiling now with these parameters:`);
  try {
    await run(argv);
  } catch (err) {
    console.log(`error: ${err}`);
    process.exit(1);
  }
})();