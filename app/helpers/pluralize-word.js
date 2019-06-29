import { helper } from '@ember/component/helper';

export function pluralizeWord([value, singularWord, pluralWord]) {
  let pluralizedWord = pluralWord
  if(value === 1){
    pluralizedWord = singularWord
  }
  return pluralizedWord;
}

export default helper(pluralizeWord);
