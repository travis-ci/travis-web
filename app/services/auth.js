/* global Travis */
import { get, observer, computed } from '@ember/object';

import { isEmpty } from '@ember/utils';
import { Promise as EmberPromise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import { alias } from '@ember/object/computed';
import { getOwner } from '@ember/application';

import URLPolyfill from 'travis/utils/url';

const proVersion = config.featureFlags['pro-version'];

// Collects the list of includes from all requests
// and ensures the future fetches don't override previously loaded includes
let includes = [];

export default Service.extend({
  router: service(),
  flashes: service(),
  intercom: service(),
  store: service(),
  storage: service(),
  sessionStorage: service(),
  ajax: service(),

  state: 'signed-out',
  receivingEnd: `${location.protocol}//${location.host}`,
  tokenExpiredMsg: 'You\'ve been signed out, because your access token has expired.',

  init() {
    this.afterSignOutCallbacks = [];
    return this._super(...arguments);
  },

  token: computed(function () {
    return this.sessionStorage.getItem('travis.token');
  }),

  assetToken() {
    return JSON.parse(this.sessionStorage.getItem('travis.user'))['token'];
  },

  endpoint: config.authEndpoint || config.apiEndpoint,

  signOut() {
    this.sessionStorage.clear();
    this.storage.clear();
    this.set('state', 'signed-out');
    this.set('user', null);
    this.set('currentUser', null);
    this.clearNonAuthFlashes();
    this.runAfterSignOutCallbacks();
    this.store.unloadAll();
  },

  signIn(data, options = {}) {
    if (data) {
      this.autoSignIn(data);
    } else {
      this.set('state', 'signing-in');

      let uri = options.redirectUri || window.location.href,
        url = new URLPolyfill(uri);

      if (url.pathname === '/plans') {
        url.pathname = '/';
      }

      window.location = `${this.endpoint}/auth/handshake?redirect_uri=${url}`;
    }
  },

  autoSignIn(data) {
    if (!data) {
      data = this.userDataFrom(this.sessionStorage) ||
             this.userDataFrom(this.storage);
    }

    if (data) {
      this.setData(data);
      this.refreshUserData().then(() => {
      }, (xhr) => {
        // if xhr is not defined it means that scopes are not correct,
        // so log the user out. Also log the user out if the response is 401
        // or 403
        if (!xhr || (xhr.status === 401 || xhr.status === 403)) {
          this.flashes.error(this.tokenExpiredMsg);
          this.signOut();
        }
      });
    }
  },

  afterSignOut(callback) {
    this.afterSignOutCallbacks.push(callback);
  },

  runAfterSignOutCallbacks() {
    this.afterSignOutCallbacks.forEach((callback) => {
      callback();
    });
  },

  userDataFrom(storage) {
    let token, user, userJSON;
    userJSON = storage.getItem('travis.user');
    if (userJSON != null) {
      try {
        user = JSON.parse(userJSON);
      } catch (e) {
        user = null;
      }
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
    isTravisBecome = this.sessionStorage.getItem('travis.become');
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
    this.storeData(data, this.sessionStorage);
    if (!this.userDataFrom(this.storage)) {
      this.storeData(data, this.storage);
    }
    user = this.loadUser(data.user);
    this.set('currentUser', user);
    this.set('state', 'signed-in');
    this.userSignedIn(data.user);
  },

  userSignedIn(user) {
    if (proVersion && get(config, 'intercom.enabled')) {
      this.intercom.set('user.id', user.id);
      this.intercom.set('user.name', user.name);
      this.intercom.set('user.email', user.email);
      this.intercom.set('user.createdAt', user.first_logged_in_at);
      this.intercom.set('user.hash', user.secure_user_hash);
    }
    Travis.trigger('user:signed_in', user);
  },

  refreshUserData(user, include = []) {
    includes = includes.concat(include, ['owner.installation']).uniq();
    if (!user) {
      let data = this.userDataFrom(this.sessionStorage) ||
                 this.userDataFrom(this.storage);
      if (data) {
        user = data.user;
      }
    }
    if (user) {
      return this.ajax.get(`/users/${user.id}`)
        .then(data => {
          let userRecord;
          if (data.user.correct_scopes) {
            userRecord = this.loadUser(data.user);
            userRecord.get('permissions');
            if (this.signedIn) {
              data.user.token = user.token;
              this.storeData(data, this.sessionStorage);
              this.storeData(data, this.storage);
              Travis.trigger('user:refreshed', data.user);
            }
            return this.store.queryRecord('user', {
              current: true,
              included: includes.join(',')
            });
          } else {
            return EmberPromise.reject();
          }
        })
        .then(({ installation = null }) => {
          this.currentUser.setProperties({ installation });
        })
        .catch((exception) => {
          if (exception.status && exception.status === 500) {
            this.signOut();
          }
          throw exception;
        });
    } else {
      return EmberPromise.resolve();
    }
  },

  signedIn: computed('state', function () {
    let state = this.state;
    return state === 'signed-in';
  }),

  signedOut: computed('state', function () {
    let state = this.state;
    return state === 'signed-out';
  }),

  signingIn: computed('state', function () {
    let state = this.state;
    return state === 'signing-in';
  }),

  storeData(data, storage) {
    if (data.token) {
      storage.setItem('travis.token', data.token);
    }
    return storage.setItem('travis.user', JSON.stringify(data.user));
  },

  loadUser(user) {
    let store = this.store,
      userClass = store.modelFor('user'),
      serializer = store.serializerFor('user'),
      normalized = serializer.normalizeResponse(store, userClass, user, null, 'findRecord');

    store.push(normalized);
    const record =  store.recordForId('user', user.id);
    const installation = store.peekAll('installation').findBy('owner.id', user.id) || null;
    record.setProperties({ installation });
    return record;
  },

  expectedOrigin() {
    let endpoint = this.endpoint;
    if (endpoint && endpoint[0] === '/') {
      return this.receivingEnd;
    } else {
      let matches = endpoint.match(/^https?:\/\/[^\/]*/);
      if (matches && matches.length) {
        return matches[0];
      }
    }
  },

  clearNonAuthFlashes() {
    const flashMessages = this.get('flashes.flashes') || [];
    const errorMessages = flashMessages.filterBy('type', 'error');
    if (!isEmpty(errorMessages)) {
      const errMsg = errorMessages.get('firstObject.message');
      if (errMsg !== this.tokenExpiredMsg) {
        return this.flashes.clear();
      }
    } else {
      return this.flashes.clear();
    }
  },

  sync() {
    return this.currentUser.sync();
  },

  syncingDidChange: observer('isSyncing', 'currentUser', function () {
    const user = this.currentUser;
    if (user && user.get('isSyncing') && !user.get('syncedAt')) {
      return this.router.transitionTo('first_sync');
    }
  }),

  userName: computed('currentUser.{login,name}', function () {
    let login = this.get('currentUser.login');
    let name = this.get('currentUser.name');
    return name || login;
  }),

  gravatarUrl: computed('currentUser.gravatarId', function () {
    let gravatarId = this.get('currentUser.gravatarId');
    return `${location.protocol}//www.gravatar.com/avatar/${gravatarId}?s=48&d=mm`;
  }),

  permissions: alias('currentUser.permissions'),

  actions: {
    signIn(runAfterSignIn) {
      let applicationRoute = getOwner(this).lookup('route:application');
      applicationRoute.send('signIn', runAfterSignIn);
    },

    signOut() {
      this.signOut();
    }
  }
});
