import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';
import formatCommit from 'travis/utils/format-commit';

export default helper((params) => {
  const [commit] = params;
  if (commit) {

  const theHtml = formatCommit(commit.get('sha'), commit.get('branch'));
    return new htmlSafe(`${theHtml}`);
  }
});
