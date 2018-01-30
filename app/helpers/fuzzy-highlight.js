import fuzzyMatch from 'travis/utils/fuzzy-match';
import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';

export function fuzzyHighlight([slug, query]) {
  const highlighted =  fuzzyMatch(slug, query);
  return new htmlSafe(highlighted);
}

export default helper(fuzzyHighlight);
