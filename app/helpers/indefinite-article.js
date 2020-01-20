import { helper } from '@ember/component/helper';

export default helper(([word], {uppercase}) => {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return word && (uppercase ? 'A' : 'a').concat(vowels.indexOf(word.charAt(0).toLowerCase()) !== -1 ? 'n' : '');
});
