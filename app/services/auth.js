/* global Travis */
import URL from 'url';
import {
  computed,
  getProperties,
  observer,
  get
} from '@ember/object';
import { isEmpty } from '@ember/utils';
import Service, { inject as service } from '@ember/service';
import { equal, reads } from '@ember/object/computed';
import { getOwner } from '@ember/application';
import config from 'travis/config/environment';
import { Promise } from 'rsvp';

const { authEndpoint, apiEndpoint, intercom = {} } = config;

// Collects the list of includes from all requests
// and ensures the future fetches don't override previously loaded includes
let includes = [];

const afterSignOutCallbacks = [];

const STATE = {
  SIGNED_OUT: 'signed-out',
  SIGNED_IN: 'signed-in',
  SIGNING_IN: 'signing-in'
};

const USER_FIELDS = ['id', 'login', 'token', 'correct_scopes', 'channels'];

const TOKEN_EXPIRED_MSG = "You've been signed out, because your access token has expired.";

export default Service.extend({
  router: service(),
  flashes: service(),
  intercom: service(),
  store: service(),
  localStorage: service('storage'),
  sessionStorage: service(),
  ajax: service(),
  features: service(),
  metrics: service(),

  state: STATE.SIGNED_OUT,

  signedIn: equal('state', STATE.SIGNED_IN),
  signedOut: equal('state', STATE.SIGNED_OUT),
  signingIn: equal('state', STATE.SIGNING_IN),

  isProVersion: reads('features.proVersion'),

  storage: computed('sessionStorage.authUpdatedAt', 'localStorage.authUpdatedAt', function () {
    // primary storage for auth is the one in which auth data was updated last
    const { sessionStorage, localStorage } = this;
    return sessionStorage.authUpdatedAt > localStorage.authUpdatedAt ? sessionStorage : localStorage;
  }),

  currentUser: null,

  permissions: reads('currentUser.permissions'),

  token: reads('storage.token'),
  assetToken: reads('currentUser.token'),

  userName: reads('currentUser.fullName'),
  gravatarUrl: reads('currentUser.gravatarUrl'),

  redirectUrl: null,

  signOut(runTeardown = true) {
    this.storage.clearAuthData();

    this.setProperties({
      state: STATE.SIGNED_OUT,
      currentUser: null
    });

    if (runTeardown) {
      this.clearNonAuthFlashes();
      runAfterSignOutCallbacks();
    }
    this.store.unloadAll();
  },

  afterSignOut(callback) {
    afterSignOutCallbacks.push(callback);
  },

  signIn() {
    this.autoSignIn();
    if (this.signedIn) return;

    this.set('state', STATE.SIGNING_IN);

    const url = new URL(this.redirectUrl || window.location.href);

    if (url.pathname === '/plans') {
      url.pathname = '/';
    }
    window.location.href = `${authEndpoint || apiEndpoint}/auth/handshake?redirect_uri=${url}`;
  },

  autoSignIn() {
    try {
      const data = JSON.parse(this.storage.user);
      const userData = getProperties(data.user || data, USER_FIELDS);

      this.validateUserData(userData);

      this.setProperties({
        currentUser: createUserRecord(this.store, userData),
        state: STATE.SIGNED_IN
      });

      Travis.trigger('user:signed_in', this.currentUser);

      this.reloadCurrentUser()
        .then(() => {
          this.reportNewUser();
          this.reportToIntercom();
          Travis.trigger('user:refreshed', data.user);
        })
        .catch((error = {}) => {
          const status = +error.status || +get(error, 'errors.firstObject.status');
          if (status === 401 || status === 403 || status === 500) {
            this.flashes.error(TOKEN_EXPIRED_MSG);
            this.signOut();
          }
        });
    } catch (error) {
      this.signOut(false);
    }
  },

  reloadCurrentUser(include = []) {
    includes = includes.concat(include, ['owner.installation']).uniq();
    const options = { included: includes.join(',') };
    const { currentUser } = this;
    return currentUser ? currentUser.reload(options) : Promise.resolve();
  },

  validateUserData(user) {
    const hasChannelsOnPro = field => field === 'channels' && !this.isProVersion;
    const hasAllFields = USER_FIELDS.every(field => !!user[field] || hasChannelsOnPro(field));
    if (!hasAllFields || !user.correct_scopes) {
      throw new Error('User validation failed');
    }
  },

  reportToIntercom() {
    if (this.isProVersion && intercom.enabled) {
      const { id, name, email, firstLoggedInAt, secureUserHash } = this.currentUser;
      this.intercom.setProperties({
        'user.id': id,
        'user.name': name,
        'user.email': email,
        'user.createdAt': firstLoggedInAt,
        'user.hash': secureUserHash
      });
    }
  },

  reportNewUser() {
    const { currentUser, metrics } = this;
    const { syncedAt, login } = currentUser;
    const signupUsers = this.storage.signupUsers || [];

    if (!syncedAt && !signupUsers.includes(login)) {
      metrics.trackPage({ page: '/virtual/signup-success' });
      this.storage.signupUsers = signupUsers.concat([login]);
    }
  },

  // refreshUserData(user, include = []) {
  //   includes = includes.concat(include, ['owner.installation']).uniq();
  //   if (!user) {
  //     let data = this.userDataFromStorage();
  //     if (data) {
  //       user = data.user;
  //     }
  //   }
  //   if (user) {
  //     return this.ajax.get(`/users/${user.id}`)
  //       .then(data => {
  //         let userRecord;
  //         if (data.user.correct_scopes) {
  //           userRecord = this.loadUser(data.user);
  //           userRecord.get('permissions');
  //           if (this.signedIn) {
  //             data.user.token = user.token;
  //             Travis.trigger('user:refreshed', data.user);
  //           }
  //           return this.store.queryRecord('user', {
  //             current: true,
  //             included: includes.join(',')
  //           });
  //         } else {
  //           return Promise.reject();
  //         }
  //       })
  //       .then(({ installation = null }) => {
  //         this.currentUser.setProperties({ installation });
  //       });
  //   } else {
  //     return Promise.resolve();
  //   }
  // },


  clearNonAuthFlashes() {
    const flashMessages = this.get('flashes.flashes') || [];
    const errorMessages = flashMessages.filterBy('type', 'error');
    if (!isEmpty(errorMessages)) {
      const errMsg = errorMessages.get('firstObject.message');
      if (errMsg !== TOKEN_EXPIRED_MSG) {
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

function createUserRecord(store, user) {
  const record = store.push(store.normalize('user', user));
  const installation = store.peekAll('installation').findBy('owner.id', user.id) || null;
  record.setProperties({ installation });
  return record;
}

function runAfterSignOutCallbacks() {
  afterSignOutCallbacks.forEach(callback => callback());
  afterSignOutCallbacks.clear();
}

