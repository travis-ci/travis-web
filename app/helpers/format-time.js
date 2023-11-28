import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';
import timeAgoInWords from 'travis/utils/time-ago-in-words';

export default helper((params) => {
  const [time] = params;
  const timeText = timeAgoInWords(time) || '-';

  return new htmlSafe(`${timeText}`);
});
