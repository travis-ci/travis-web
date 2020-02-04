import Component from '@ember/component';
import { computed } from '@ember/object';

const COLORS = {
  bitbucket: 'blue'
};

export default Component.extend({
  tagName: '',

  number: null,
  provider: null,
  providerImg: false,
  title: '',

  dir: computed('number', function () {
    const { number } = this;
    return (number && number % 2 === 1) ? 'row' : 'row-reverse';
  }),

  imageName: computed('number', 'provider', 'providerImg', function () {
    const { number, provider, providerImg } = this;
    const affix = providerImg ? `-${provider}` : '';
    return `getting-started-step-${number}${affix}`;
  }),

  color: computed('provider', function () {
    const { provider } = this;
    return COLORS[provider];
  }),
});