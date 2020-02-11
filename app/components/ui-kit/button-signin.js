import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { or, reads } from '@ember/object/computed';

const providerColors = {
  github: 'grey-dark',
  bitbucket: 'blue',
  assembla: 'grey',
};

export default Component.extend({
  tagName: '',

  auth: service(),
  multiVcs: service(),

  account: null,

  isSignup: false,
  provider: or('account.provider', 'multiVcs.primaryProvider'),

  vcsType: computed('provider', function () {
    return `${this.provider.capitalize()}User`;
  }),

  isPrimaryProvider: computed('provider', function () {
    return this.multiVcs.isProviderPrimary(this.provider);
  }),

  isProviderEnabled: computed('provider', 'isPrimaryProvider', function () {
    const { provider, isPrimaryProvider, multiVcs } = this;

    return isPrimaryProvider || (multiVcs.enabled && multiVcs.isProviderEnabled(provider));
  }),

  isBetaProvider: computed('provider', function () {
    return this.multiVcs.isProviderBeta(this.provider);
  }),

  color: computed('provider', function () {
    return providerColors[this.provider] || 'grey';
  }),
  badgeColor: computed('color', function () {
    return `${this.color}-light`;
  }),

  signin() {
    if (this.account) {
      this.auth.switchAccount(this.account.id);
    } else {
      this.auth.signInWith(this.provider);
    }
  },
});
