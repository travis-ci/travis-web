import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { and, not, or, reads } from '@ember/object/computed';
import { defaultVcsConfig, vcsConfig } from 'travis/utils/vcs';

export default Service.extend({
  auth: service(),
  features: service(),

  isProVersion: reads('features.proVersion'),

  enabled: or('enableAssemblaLogin', 'enableBitbucketLogin', 'enableGitlabLogin'),
  disabled: not('enabled'),

  enableAssemblaLogin: and('isProVersion', 'features.enableAssemblaLogin'),
  enableBitbucketLogin: and('isProVersion', 'features.enableBitbucketLogin'),
  enableGitlabLogin: and('isProVersion', 'features.gitlabLogin'),

  primaryProviderConfig: computed(() => defaultVcsConfig),
  primaryProvider: reads('primaryProviderConfig.urlPrefix'),

  isProviderEnabled(provider) {
    const { isProVersion, features } = this;
    const isEnabled = features.isEnabled(`enable-${provider}-login`) || features.isEnabled(`${provider}-login`);
    return isProVersion && isEnabled;
  },

  isProviderPrimary(provider) {
    return provider === this.primaryProvider;
  },

  isProviderBeta(provider) {
    return !this.isProviderPrimary(provider);
  },

  currentProviderConfig: computed('auth.currentUser.vcsType', function () {
    const { currentUser } = this.auth;
    if (currentUser) {
      const { vcsType } = currentUser;
      return vcsConfig(vcsType);
    }
  }),

  currentProvider: reads('currentProviderConfig.urlPrefix'),

  currentProviderIsBeta: computed('currentProvider', function () {
    return this.isProviderBeta(this.currentProvider);
  }),
});
