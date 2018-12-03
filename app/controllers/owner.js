import Controller from '@ember/controller';
import { computed } from '@ember/object';
import config from 'travis/config/environment';

export default Controller.extend({
  isLoading: false,

  config,

  githubProfile: computed('model.login', function () {
    let login = this.get('model.login');
    const { sourceEndpoint } = config;
    return `${sourceEndpoint}/${login}`;
  }),

  owner: computed('model', function () {
    let model = this.get('model');
    return {
      login: model.login,
      name: model.name,
      avatar: model.avatar_url,
      isSyncing: model.is_syncing,
      avatarUrl: model.avatar_url,
      syncedAt: model.synced_at
    };
  })
});
