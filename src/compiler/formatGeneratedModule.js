/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule formatGeneratedModule
 * @format
 */

'use strict';

const formatGeneratedModule = ({
  documentType,
  docText,
  concreteText,
  flowText,
  hash,
  relayRuntimeModule,
  sourceHash,
  devOnlyAssignments,
}) => {
  const docTextComment = docText ? '\n/*\n' + docText.trim() + '\n*/\n' : '';
  const hashText = hash ? `\n * ${hash}` : '';
  return `/**
 * ${'@'}flow${hashText}
 */

/* eslint-disable */

'use strict';

/*::
import type { ${documentType} } from '${relayRuntimeModule}';
${flowText || ''}
*/

${docTextComment}
const node/*: ${documentType}*/ = ${concreteText};
const node2 = ${devOnlyAssignments};
(node/*: any*/).hash = '${sourceHash}';
module.exports = node;
`;
};

module.exports = formatGeneratedModule;
