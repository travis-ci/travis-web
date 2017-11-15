import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import formatSha from 'travis/utils/format-sha';

export default helper((params) => {
  const [sha] = params;
  const formattedSha = formatSha(sha);
  return new htmlSafe(formattedSha);
});
