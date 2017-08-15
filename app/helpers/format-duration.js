import timeInWords from 'travis/utils/time-in-words';
import Ember from 'ember';

export default Ember.Helper.helper((params) => {
  const [time] = params;
  const timeText = timeInWords(time);
  return new Ember.String.htmlSafe(timeText);
});
