import { helper } from '@ember/component/helper';

export function pluralizeWord([value, singularWord, pluralWord]) {
  return value === 1 ? singularWord : pluralWord;
}

export default helper(pluralizeWord);
