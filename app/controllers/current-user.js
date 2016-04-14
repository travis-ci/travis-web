import Ember from 'ember';

export default Ember.Controller.extend({
  sync() {
    return this.get('model').sync();
  },

  model: Ember.computed.alias('auth.currentUser'),

  syncingDidChange: function() {
    var user;
    if ((user = this.get('model')) && user.get('isSyncing') && !user.get('syncedAt')) {
      return Ember.run.scheduleOnce('routerTransitions', this, function() {
        return Ember.getOwner(this).lookup('router:main').send('renderFirstSync');
      });
    }
  }.observes('isSyncing', 'auth.currentUser')
});
