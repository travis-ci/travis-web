import { pluralize } from 'ember-inflector';
import { helper } from '@ember/component/helper';
import { vcsVocab } from 'travis/utils/vcs';

export default helper(([vcsType, vocabKey], { plural, lower }) => {
  let text = vcsVocab(vcsType, vocabKey);
  text = plural ? pluralize(text) : text;
  text = lower ? text.toLowerCase() : text;
  return text;
});
