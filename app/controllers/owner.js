import Ember from 'ember';

export default Ember.Controller.extend({
  isLoading: false,

  githubProfile: function() {
    return "https://github.com/" + (this.get('model.login'));
  }.property('model'),

  avatarURL: function() {
    if (this.get('model.avatar_url')) {
      return (this.get('model.avatar_url')) + "?s=125";
    } else {
      return 'https://secure.gravatar.com/avatar/?d=mm&s=125';
    }
  }.property('model'),

  owner: function() {
    var data;
    data = this.get('model');
    return {
      login: data.login,
      name: data.name,
      isSyncing: data.is_syncing,
      avatarUrl: data.avatar_url,
      syncedAt: data.synced_at
    };
  }.property('model')
});
