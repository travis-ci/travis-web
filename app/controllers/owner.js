import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

export default Controller.extend({
  isLoading: false,

  config,

  @computed('model.login')
  githubProfile(login) {
    const { sourceEndpoint } = config;
    return `${sourceEndpoint}/${login}`;
  },

  @computed('model')
  owner(model) {
    return {
      login: model.login,
      name: model.name,
      avatar: model.avatar_url,
      isSyncing: model.is_syncing,
      avatarUrl: model.avatar_url,
      syncedAt: model.synced_at
    };
  },
});
