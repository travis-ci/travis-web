import timeAgoInWords from 'travis/utils/time-ago-in-words';
import Ember from 'ember';

export default Ember.Helper.helper((params) => {
  const [time] = params;
  const timeText = timeAgoInWords(time) || '-';
  return new Ember.String.htmlSafe(timeText);
});
