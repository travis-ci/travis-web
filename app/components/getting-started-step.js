import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  number: null,
  provider: null,
  providerImg: false,
  title: '',

  smDir: computed('number', function () {
    const { number } = this;
    return (number && number % 2 === 1) ? 'row' : 'row-reverse';
  }),

  imageName: computed('number', 'provider', 'providerImg', function () {
    const { number, provider, providerImg } = this;
    const affix = providerImg ? `-${provider}` : '';
    return `getting-started-step-${number}${affix}`;
  }),
});
