import formatSha from 'travis/utils/format-sha';
import Ember from 'ember';

export default Ember.Helper.helper((params) => {
  const [sha] = params;
  const formattedSha = formatSha(sha);
  return new Ember.String.htmlSafe(formattedSha);
});
