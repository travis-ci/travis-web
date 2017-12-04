import Ember from 'ember';
import fuzzyMatch from 'travis/utils/fuzzy-match';

export function fuzzyHighlight([slug, query]) {
  const highlighted =  fuzzyMatch(slug, query);
  return new Ember.String.htmlSafe(highlighted);
}

export default Ember.Helper.helper(fuzzyHighlight);
