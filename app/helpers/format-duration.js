import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import timeInWords from 'travis/utils/time-in-words';

export default helper((params) => {
  const [time] = params;
  const timeText = timeInWords(time);
  return new htmlSafe(timeText);
});
