import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  auth: service(),
  multiVcs: service(),

  isSignup: false,
  provider: reads('multiVcs.primaryProvider'),
  isLogoVisible: true,
  isBetaBadgeVisible: reads('isBetaProvider'),
  minWidth: 'md',

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

  signin() {
    this.auth.signInWith(this.provider);
  },
});
