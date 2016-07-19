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
  userName: Ember.computed('currentUser.login', 'currentUser.name', function () {
    return this.get('currentUser.name') || this.get('currentUser.login');
  }),

  gravatarUrl: Ember.computed('currentUser.gravatarId', function () {
    let gravatarId = this.get('currentUser.gravatarId');
    return `${location.protocol}//www.gravatar.com/avatar/${gravatarId}?s=48&d=mm`;
  }),

  permissions: Ember.computed.alias('currentUser.permissions'),

  signedIn: Ember.computed('state', function () {
    return this.get('state') === 'signed-in';
  }),

  signedOut: Ember.computed('state', function () {
    return this.get('state') === 'signed-out';
  }),

  signingIn: Ember.computed('state', function () {
    return this.get('state') === 'signing-in';
  }),

  token() {
    if (this.get('state') === 'signed-in') {
      return 'a-token';
    }
  },

  refreshUserData() {
    return Ember.RSVP.Promise.resolve();
  }
});
