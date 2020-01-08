import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  features: service(),

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

  isProviderEnabled(provider) {
    return this.features.isEnabled(`enable-${provider}-login`);
  },
});
