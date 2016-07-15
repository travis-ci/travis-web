import Ember from 'ember';

export default Ember.Object.extend({
  state: 'signed-out',

  // I want to disable auto sign in for tests for now, the plan is to either
  // explicitly say that you're signed in or out (the latter being the default)
  autoSignIn() {},
  signOutForTests() {
    this.set('state', 'signed-out');
    return this.set('currentUser', null);
  },

  signInForTests(user) {
    this.set('state', 'signed-in');
    if ((user.constructor.modelName != null) !== 'user') {
      this.store.push({
        data: {
          type: 'user',
          id: user.id,
          attributes: user
        }
      });
      user = this.store.recordForId('user', user.id);
    }
    return this.set('currentUser', user);
  },

  // TODO: we use these properties in templates, but there
  //       really should be something like a 'session' service that can be
  //       injected where we need it
  userName: function() {
    return this.get('currentUser.name') || this.get('currentUser.login');
  }.property('currentUser.login', 'currentUser.name'),

  gravatarUrl: function() {
    return location.protocol + "//www.gravatar.com/avatar/" + (this.get('currentUser.gravatarId')) + "?s=48&d=mm";
  }.property('currentUser.gravatarId'),

  permissions: Ember.computed.alias('currentUser.permissions'),

  signedIn: function() {
    return this.get('state') === 'signed-in';
  }.property('state'),

  signedOut: function() {
    return this.get('state') === 'signed-out';
  }.property('state'),

  signingIn: function() {
    return this.get('state') === 'signing-in';
  }.property('state'),

  token() {
    if (this.get('state') === 'signed-in') {
      return 'a-token';
    }
  },

  refreshUserData() {
    return Ember.RSVP.Promise.resolve();
  }
});
