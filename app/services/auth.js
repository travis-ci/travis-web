import config from 'travis/config/environment';
import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Service.extend({
  flashes: service(),
  store: service(),
  storage: service(),
  sessionStorage: service(),
  ajax: service(),
  state: "signed-out",
  receivingEnd: location.protocol + "//" + location.host,

  init: function() {
    return window.addEventListener('message', (e) => {
      return this.receiveMessage(e);
    });
  },

  token() {
    return this.get('sessionStorage').getItem('travis.token');
  },

  endpoint: function() {
    return config.authEndpoint || config.apiEndpoint;
  }.property(),

  signOut: function() {
    var user;
    this.get('sessionStorage').clear();
    this.get('storage').clear();
    this.set('state', 'signed-out');
    this.set('user', null);

    this.get('store').unloadAll();

    this.set('currentUser', null);
    this.sendToApp('afterSignOut');

    Travis.trigger('user:signed_out');
  },

  signIn(data) {
    var url;
    if (data) {
      this.autoSignIn(data);
    } else {
      this.set('state', 'signing-in');
      url = (this.get('endpoint')) + "/auth/post_message?origin=" + this.receivingEnd;
      return $('<iframe id="auth-frame" />').hide().appendTo('body').attr('src', url);
    }
  },

  autoSignIn(data) {
    if(!data) {
      data = this.userDataFrom(this.get('sessionStorage')) ||
             this.userDataFrom(this.get('storage'));
    }

    if (data) {
      this.setData(data);
      this.refreshUserData().then( () => {
      }, (xhr) => {
        // if xhr is not defined it means that scopes are not correct,
        // so log the user out. Also log the user out if the response is 401
        // or 403
        if(!xhr || (xhr.status === 401 || xhr.status === 403)) {
          this.get('flashes').error("You've been signed out, because your access token has expired.");
          this.signOut();
        }
      });
    }
  },

  userDataFrom(storage) {
    var token, user, userJSON;
    userJSON = storage.getItem('travis.user');
    if (userJSON != null) {
      user = JSON.parse(userJSON);
    }
    if (user != null ? user.user : void 0) {
      user = user.user;
    }
    token = storage.getItem('travis.token');
    if (user && token && this.validateUser(user)) {
      return {
        user: user,
        token: token
      };
    } else {
      storage.removeItem('travis.user');
      storage.removeItem('travis.token');
      return null;
    }
  },

  validateUser(user) {
    var fieldsToValidate, isTravisBecome;
    fieldsToValidate = ['id', 'login', 'token'];
    isTravisBecome = this.get('sessionStorage').getItem('travis.become');
    if (!isTravisBecome) {
      fieldsToValidate.push('correct_scopes');
    }
    if (config.pro) {
      fieldsToValidate.push('channels');
    }
    return fieldsToValidate.every((function(_this) {
      return function(field) {
        return _this.validateHas(field, user);
      };
    })(this)) && (isTravisBecome || user.correct_scopes);
  },

  validateHas(field, user) {
    if (user[field]) {
      return true;
    } else {
      return false;
    }
  },

  setData(data) {
    var user;
    this.storeData(data, this.get('sessionStorage'));
    if (!this.userDataFrom(this.get('storage'))) {
      this.storeData(data, this.get('storage'));
    }
    user = this.loadUser(data.user);
    this.set('currentUser', user);
    this.set('state', 'signed-in');
    Travis.trigger('user:signed_in', data.user);
    this.sendToApp('afterSignIn');
  },

  refreshUserData(user) {
    var data;
    if (!user) {
      if (data = this.userDataFrom(this.get('sessionStorage')) || this.userDataFrom(this.get('storage'))) {
        user = data.user;
      }
    }
    if (user) {
      return this.get('ajax').get("/users/" + user.id).then( (data) => {
        var userRecord;
        if (data.user.correct_scopes) {
          userRecord = this.loadUser(data.user);
          userRecord.get('permissions');
          if (this.get('signedIn')) {
            data.user.token = user.token;
            this.storeData(data, this.get('sessionStorage'));
            this.storeData(data, this.get('storage'));
            Travis.trigger('user:refreshed', data.user);
          }
        } else {
          return Ember.RSVP.Promise.reject();
        }
      });
    } else {
      return Ember.RSVP.Promise.resolve();
    }
  },

  signedIn: function() {
    return this.get('state') === 'signed-in';
  }.property('state'),

  signedOut: function() {
    return this.get('state') === 'signed-out';
  }.property('state'),

  signingIn: function() {
    return this.get('state') === 'signing-in';
  }.property('state'),

  storeData(data, storage) {
    if (data.token) {
      storage.setItem('travis.token', data.token);
    }
    return storage.setItem('travis.user', JSON.stringify(data.user));
  },

  loadUser(user) {
    var store = this.get('store'),
        adapter = store.adapterFor('user'),
        userClass = store.modelFor('user'),
        serializer = store.serializerFor('user'),
        normalized = serializer.normalizeResponse(store, userClass, user, null, 'findRecord');

    store.push(normalized);
    return store.recordForId('user', user.id);
  },

  receiveMessage(event) {
    if (event.origin === this.expectedOrigin()) {
      if (event.data === 'redirect') {
        return window.location = (this.get('endpoint')) + "/auth/handshake?redirect_uri=" + location;
      } else if (event.data.user != null) {
        if (event.data.travis_token) {
          event.data.user.token = event.data.travis_token;
        }
        return this.setData(event.data);
      }
    }
  },

  expectedOrigin() {
    var endpoint;
    endpoint = this.get('endpoint');
    if (endpoint[0] === '/') {
      return this.receivingEnd;
    } else {
      return endpoint.match(/^https?:\/\/[^\/]*/)[0];
    }
  },

  sendToApp(name) {
    var error, router;

    // TODO: this is an ugly solution, we need to do one of 2 things:
    //       * find a way to check if we can already send an event to remove try/catch
    //       * remove afterSignIn and afterSignOut events by replacing them in a more
    //         straightforward code - we can do what's needed on a routes/controller level
    //         as a direct response to either manual sign in or autoSignIn (right now
    //         we treat both cases behave the same in terms of sent events which I think
    //         makes it more complicated than it should be).
    router = Ember.getOwner(this).lookup('router:main');
    try {
      return router.send(name);
    } catch (error1) {
      error = error1;
      if (!(error.message.match(/Can't trigger action/))) {
        throw error;
      }
    }
  },

  userName: function() {
    return this.get('currentUser.name') || this.get('currentUser.login');
  }.property('currentUser.login', 'currentUser.name'),

  gravatarUrl: function() {
    return location.protocol + "//www.gravatar.com/avatar/" + (this.get('currentUser.gravatarId')) + "?s=48&d=mm";
  }.property('currentUser.gravatarId'),

  permissions: Ember.computed.alias('currentUser.permissions')
});
