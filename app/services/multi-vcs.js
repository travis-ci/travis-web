import Service, { inject as service } from '@ember/service';
import { and, not, or, reads } from '@ember/object/computed';

export default Service.extend({
  features: service(),

  isProVersion: reads('features.proVersion'),

  enabled: or('enableAssemblaLogin', 'enableBitbucketLogin'),
  disabled: not('enabled'),

  enableAssemblaLogin: and('isProVersion', 'features.enableAssemblaLogin'),
  enableBitbucketLogin: and('isProVersion', 'features.enableBitbucketLogin'),

  primaryProvider: 'github',

  isProviderEnabled(provider) {
    return this.isProVersion && this.features.isEnabled(`enable-${provider}-login`);
  },
});
