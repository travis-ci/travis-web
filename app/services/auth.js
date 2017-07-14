/* global Travis */
import config from 'travis/config/environment';
import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

const { service } = Ember.inject;

export default Ember.Service.extend({
  router: service(),
  flashes: service(),
  store: service(),
  storage: service(),
  sessionStorage: service(),
  ajax: service(),
  state: 'signed-out',
  receivingEnd: `${location.protocol}//${location.host}`,

  token() {
    return this.get('sessionStorage').getItem('travis.token');
  },

  assetToken() {
    return JSON.parse(this.get('sessionStorage').getItem('travis.user'))['token'];
  },

  endpoint: config.authEndpoint || config.apiEndpoint,

  signOut() {
    this.get('sessionStorage').clear();
    this.get('storage').clear();
    this.set('state', 'signed-out');
    this.set('user', null);
    this.get('store').unloadAll();
    this.set('currentUser', null);
  },

  signIn(data) {
    if (data) {
      this.autoSignIn(data);
    } else {
      this.set('state', 'signing-in');
      window.location = `${this.get('endpoint')}/auth/handshake?redirect_uri=${location}`;
    }
  },

  autoSignIn(data) {
    if (!data) {
      data = this.userDataFrom(this.get('sessionStorage')) ||
             this.userDataFrom(this.get('storage'));
    }

    if (data) {
      this.setData(data);
      this.refreshUserData().then(() => {
      }, (xhr) => {
        // if xhr is not defined it means that scopes are not correct,
        // so log the user out. Also log the user out if the response is 401
        // or 403
        if (!xhr || (xhr.status === 401 || xhr.status === 403)) {
          let errorText = "You've been signed out, because your access token has expired.";
          this.get('flashes').error(errorText);
          this.signOut();
        }
      });
    }
  },

  userDataFrom(storage) {
    let token, user, userJSON;
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
        user,
        token
      };
    } else {
      storage.removeItem('travis.user');
      storage.removeItem('travis.token');
      return null;
    }
  },

  validateUser(user) {
    let fieldsToValidate, isTravisBecome;
    fieldsToValidate = ['id', 'login', 'token'];
    isTravisBecome = this.get('sessionStorage').getItem('travis.become');
    if (!isTravisBecome) {
      fieldsToValidate.push('correct_scopes');
    }
    if (this.get('features.proVersion')) {
      fieldsToValidate.push('channels');
    }
    return fieldsToValidate.every(field => this.validateHas(field, user)) &&
      (isTravisBecome || user.correct_scopes);
  },

  validateHas(field, user) {
    if (user[field]) {
      return true;
    } else {
      return false;
    }
  },

  setData(data) {
    let user;
    this.storeData(data, this.get('sessionStorage'));
    if (!this.userDataFrom(this.get('storage'))) {
      this.storeData(data, this.get('storage'));
    }
    user = this.loadUser(data.user);
    this.set('currentUser', user);
    this.set('state', 'signed-in');
    Travis.trigger('user:signed_in', data.user);
  },

  refreshUserData(user) {
    if (!user) {
      let data = this.userDataFrom(this.get('sessionStorage')) ||
                 this.userDataFrom(this.get('storage'));
      if (data) {
        user = data.user;
      }
    }
    if (user) {
      return this.get('ajax').get(`/users/${user.id}`).then((data) => {
        let userRecord;
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

  @computed('state')
  signedIn(state) {
    return state === 'signed-in';
  },

  @computed('state')
  signedOut(state) {
    return state === 'signed-out';
  },

  @computed('state')
  signingIn(state) {
    return state === 'signing-in';
  },

  storeData(data, storage) {
    if (data.token) {
      storage.setItem('travis.token', data.token);
    }
    return storage.setItem('travis.user', JSON.stringify(data.user));
  },

  loadUser(user) {
    let store = this.get('store'),
      userClass = store.modelFor('user'),
      serializer = store.serializerFor('user'),
      normalized = serializer.normalizeResponse(store, userClass, user, null, 'findRecord');

    store.push(normalized);
    return store.recordForId('user', user.id);
  },

  expectedOrigin() {
    let endpoint = this.get('endpoint');
    if (endpoint && endpoint[0] === '/') {
      return this.receivingEnd;
    } else {
      let matches = endpoint.match(/^https?:\/\/[^\/]*/);
      if (matches && matches.length) {
        return matches[0];
      }
    }
  },

  sync() {
    return this.get('currentUser').sync();
  },

  syncingDidChange: Ember.observer('isSyncing', 'currentUser', function () {
    const user = this.get('currentUser');
    if (user && user.get('isSyncing') && !user.get('syncedAt')) {
      return this.get('router').transitionTo('first_sync');
    }
  }),

  @computed('currentUser.{login,name}')
  userName(login, name) {
    return name || login;
  },

  @computed('currentUser.gravatarId')
  gravatarUrl(gravatarId) {
    return `${location.protocol}//www.gravatar.com/avatar/${gravatarId}?s=48&d=mm`;
  },

  // eslint-ignore-next-line
  @alias('currentUser.permissions') permissions: null,
});
