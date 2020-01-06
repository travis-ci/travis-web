import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  features: service(),
  storage: service(),

  init() {
    this._super();
    this._setEnableAssemblaLogin();
    this._setEnableBitbucketLogin();
  },

  _setEnableAssemblaLogin() {
    const enableAssemblaLogin = this.storage.getItem('enableAssemblaLogin');
    if (enableAssemblaLogin === 'true') this.features.enable('enable-assembla-login');
    if (enableAssemblaLogin === 'false') this.features.disable('enable-assembla-login');
  },

  _setEnableBitbucketLogin() {
    const enableAssemblaLogin = this.storage.getItem('enableBitbucketLogin');
    if (enableAssemblaLogin === 'true') this.features.enable('enable-bitbucket-login');
    if (enableAssemblaLogin === 'false') this.features.disable('enable-bitbucket-login');
  },

  enabled: computed('features.{enableAssemblaLogin,enableBitbucketLogin}', function () {
    return this.features.get('enableAssemblaLogin') || this.features.get('enableBitbucketLogin');
  }),

  disabled: computed('enabled', function () {
    return !this.enabled;
  }),

  enableAssemblaLogin: computed('features.enableAssemblaLogin', function () {
    return this.features.get('enableAssemblaLogin');
  }),

  enableBitbucketLogin: computed('features.enableBitbucketLogin', function () {
    return this.features.get('enableBitbucketLogin');
  }),

  primaryProvider: 'github',

  isPrimaryProvider(provider) {
    return provider === this.primaryProvider;
  },
  isProviderEnabled(provider) {
    return this.features.isEnabled(`enable-${provider}-login`);
  },
});
