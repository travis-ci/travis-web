import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import formatCommit from 'travis/utils/format-commit';

export default helper((params) => {
  const [commit] = params;
  if (commit) {
    return new htmlSafe(formatCommit(commit.get('sha'), commit.get('branch')));
  }
});
