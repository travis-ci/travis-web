var Controller;

export default Ember.Controller.extend({
  sync() {
    return this.get('model').sync();
  },

  model: Ember.computed.alias('auth.currentUser'),

  syncingDidChange: function() {
    if ((user = this.get('model')) && user.get('isSyncing') && !user.get('syncedAt')) {
      return Ember.run.scheduleOnce('routerTransitions', this, function() {
        return this.container.lookup('router:main').send('renderFirstSync');
      });
    }
  }.observes('isSyncing', 'auth.currentUser')
});
