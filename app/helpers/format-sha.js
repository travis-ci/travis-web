import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';
import formatSha from 'travis/utils/format-sha';

export default helper((params) => {
  let [sha] = params;
  if (sha && sha.includes('@')) sha = sha.split('@')[1];
  const formattedSha = formatSha(sha);

  return new htmlSafe(`<span>${formattedSha}</span>`);
});
