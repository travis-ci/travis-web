import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Controller.extend({
  isLoading: false,

  @computed('config.sourceEndpoint', 'model.login')
  githubProfile(endpoint, login) {
    return `${endpoint}/${login}`;
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
