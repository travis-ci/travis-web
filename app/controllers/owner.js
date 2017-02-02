import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,

  githubProfile: Ember.computed('model', function () {
    return this.get('config').sourceEndpoint + '/' + (this.get('model.login'));
  }),

  owner: Ember.computed('model', function () {
    var data;
    data = this.get('model');
    return {
      login: data.login,
      name: data.name,
      avatar: data.avatar_url,
      isSyncing: data.is_syncing,
      avatarUrl: data.avatar_url,
      syncedAt: data.synced_at
    };
  })
});
