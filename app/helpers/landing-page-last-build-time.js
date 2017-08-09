import timeAgoInWords from 'travis/utils/time-ago-in-words';
import Ember from 'ember';

export default Ember.Helper.helper((params) => {
  const [ranAtTime] = params;
  const ranAtText = timeAgoInWords(ranAtTime);
  const message = ranAtText || 'currently running';
  return new Ember.String.htmlSafe(message);
});
