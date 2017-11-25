import yargs from 'yargs';
import 'babel-polyfill';
import path from 'path';
import fs from 'fs';
import RelayCompiler from 'relay-compiler';
import {getFilepathsFromGlob, getRelayFileWriter, getSchema} from './ripped';
import {md5, clean} from './utils';
import {graphqlJSCompiler} from 'relay-compiler-plus';

const {
  ConsoleReporter,
  Runner: CodegenRunner,
  FileIRParser: RelayJSModuleParser,
} = RelayCompiler;
const queryCache = [];

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
const run = async (options: { schema: string, src: string, webpackConfig: string }) => {
  const srcDir = path.resolve(process.cwd(), options.src);
  console.log(`src: ${srcDir}`);

  let schemaPath;
  let customWebpackConfig = options.webpackConfig;

  if (customWebpackConfig) {
    customWebpackConfig = path.resolve(process.cwd(), customWebpackConfig);
  } else {
    schemaPath = path.resolve(process.cwd(), options.schema);
  }

  if (path.extname(schemaPath) === '.js') {
    console.log(`schemaPath: ${schemaPath}, customWebpackConfig: ${customWebpackConfig}`);
    schemaPath = await graphqlJSCompiler(schemaPath, srcDir, customWebpackConfig);
  }

  console.log(`schemaPath: ${schemaPath}`);

  clean(srcDir);

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
  } catch (err) {
    console.log(`Error codegenRunner.compileAll(): ${err}`);
    throw err;
  }

  const queryCacheOutputFile = `${srcDir}/queryMap.json`;
  try {
    fs.writeFileSync(queryCacheOutputFile, JSON.stringify(queryCache));
    console.log(`Query cache written to: ${queryCacheOutputFile}`);
  } catch (err) {
    if (err) {
      return console.log(err);
    }
  }

  console.log(`Done! ${result}`);
};

// Collect args
const argv = yargs
  .usage(`Usage: $0 --schema <schemaPath> --src <srcDir>`)
  .options({
    schema: {
      describe: `Path to schema.js or schema.graphql or schema.json`,
      demandOption: false,
      type: 'string',
    },
    src: {
      describe: 'Root directory of application code',
      demandOption: true,
      type: 'string',
    },
    webpackConfig: {
      describe: 'Custom webpack config to compile graphql-js',
      demandOption: false,
      type: 'string',
    },
  })
  .help().argv;

(async () => {
  console.log(`Welcome to relay-compiler-plus. Compiling now with these parameters:`);
  try {
    await run(argv);
  } catch (err) {
    console.log(`error: ${err}`);
    process.exit(1);
  }
})();