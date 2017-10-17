import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import timeAgoInWords from 'travis/utils/time-ago-in-words';

export default helper((params) => {
  const [ranAtTime] = params;
  const ranAtText = timeAgoInWords(ranAtTime);
  const message = ranAtText || 'currently running';
  return new htmlSafe(message);
});
