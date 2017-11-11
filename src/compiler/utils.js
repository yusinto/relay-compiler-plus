import crypto from 'crypto';
import fastGlob from 'fast-glob';
import fs from 'fs';
import path from 'path';

// Ripped from relay-compiler/RelayFileWriter.js
export const md5 = (x: string): string => {
  return crypto
    .createHash('md5')
    .update(x, 'utf8')
    .digest('hex');
};

export const clean = (src: string) => {
  console.log('Start clean...');
  const filesToClean = fastGlob.sync('**/__generated__/**/*.graphql.js', {
    cwd: src,
    bashNative: [],
    onlyFiles: true,
  });

  filesToClean.forEach(f => {
    const filePath = path.resolve(src, f);
    console.log(`deleting ${filePath}`);
    fs.unlinkSync(filePath);
  });

  console.log(`Finished cleaning`);
};


