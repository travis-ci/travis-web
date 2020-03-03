import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { or, reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  auth: service(),
  multiVcs: service(),

  account: null,

  isSignup: false,
  provider: or('account.provider', 'multiVcs.primaryProvider'),
  isLogoVisible: true,
  isLogoSeparatorVisible: true,
  isBetaBadgeVisible: reads('isBetaProvider'),
  minWidth: 'md',

  isLoading: false,

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

  minWidthClass: computed('minWidth', function () {
    const { minWidth } = this;
    return minWidth ? `min-w-${minWidth}` : '';
  }),

  logoSeparatorWidth: computed('isLogoSeparatorVisible', function () {
    return this.isLogoSeparatorVisible ? 'xs' : 'none';
  }),

  signin() {
    if (this.account) {
      this.auth.switchAccount(this.account.id, this.auth.redirectUrl || '/');
    } else {
      this.set('isLoading', true);
      this.auth.signInWith(this.provider);
    }
  },
});
