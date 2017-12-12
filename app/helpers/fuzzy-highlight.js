import Ember from 'ember';
import fuzzyMatch from 'travis/utils/fuzzy-match';
import { htmlSafe } from '@ember/string';

export function fuzzyHighlight([slug, query]) {
  const highlighted =  fuzzyMatch(slug, query);
  return new htmlSafe(highlighted);
}

export default Ember.Helper.helper(fuzzyHighlight);
