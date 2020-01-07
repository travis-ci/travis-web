import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

const providerColors = {
  github: 'green',
  bitbucket: 'blue',
  assembla: 'grey',
};

export default Component.extend({
  tagName: '',

  auth: service(),
  multiVcs: service(),

  isSignup: false,
  provider: 'github',

  vcsType: computed('provider', function () {
    return `${this.provider.capitalize()}User`;
  }),

  isPrimaryProvider: computed('provider', function () {
    return this.multiVcs.isPrimaryProvider(this.provider);
  }),

  isProviderEnabled: computed('provider', 'isPrimaryProvider', function () {
    const { provider, isPrimaryProvider, multiVcs } = this;

    return isPrimaryProvider || (multiVcs.enabled && multiVcs.isProviderEnabled(provider));
  }),

  color: computed('provider', function () {
    return providerColors[this.provider] || 'grey';
  }),

  signin() {
    this.auth.signInWith(this.provider);
  },
});
