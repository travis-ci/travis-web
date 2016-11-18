import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Service.extend({
  auth: service(),

  sync() {
    return this.get('model').sync();
  },

  model: Ember.computed.alias('auth.currentUser'),

  syncingDidChange: Ember.observer('isSyncing', 'auth.currentUser', function () {
    var user;
    if ((user = this.get('model')) && user.get('isSyncing') && !user.get('syncedAt')) {
      return Ember.run.scheduleOnce('routerTransitions', this, function () {
        return Ember.getOwner(this).lookup('router:main').send('renderFirstSync');
      });
    }
  })
});
