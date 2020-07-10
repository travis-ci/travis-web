import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { not, or, reads } from '@ember/object/computed';
import { defaultVcsConfig, vcsConfig, vcsConfigByUrlPrefix } from 'travis/utils/vcs';

export default Service.extend({
  auth: service(),
  features: service(),

  isProVersion: reads('features.proVersion'),

  enabled: or('enableAssemblaLogin', 'enableBitbucketLogin', 'enableGitlabLogin'),
  disabled: not('enabled'),

  get enableGithubLogin() { return this.isProviderEnabled('github'); },
  get enableAssemblaLogin() { return this.isProviderEnabled('assembla'); },
  get enableBitbucketLogin() { return this.isProviderEnabled('bitbucket'); },
  get enableGitlabLogin() { return this.isProviderEnabled('gitlab'); },

  primaryProviderConfig: computed(() => defaultVcsConfig),
  primaryProvider: reads('primaryProviderConfig.urlPrefix'),

  isProviderEnabled(provider) {
    const { isProVersion, features } = this;
    const isEnabled = features.isEnabled(`enable-${provider}-login`) || features.isEnabled(`${provider}-login`);
    return this.isProviderPrimary(provider) || isProVersion && isEnabled;
  },

  isProviderPrimary(provider) {
    return provider === this.primaryProvider;
  },

  isProviderBeta(provider) {
    const config = provider && vcsConfigByUrlPrefix(provider) || defaultVcsConfig;
    return config.isBeta;
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
