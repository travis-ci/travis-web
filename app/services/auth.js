/* global Travis */
import URL from 'url';
import {
  computed,
  get,
  getProperties,
  observer
} from '@ember/object';
import { assert } from '@ember/debug';
import { isEmpty, isPresent } from '@ember/utils';
import Service, { inject as service } from '@ember/service';
import {
  equal,
  or,
  reads
} from '@ember/object/computed';
import { getOwner } from '@ember/application';
import config from 'travis/config/environment';
import { task, didCancel } from 'ember-concurrency';
import {
  availableProviders,
  vcsConfigByUrlPrefixOrType
} from 'travis/utils/vcs';
import { A } from '@ember/array';
import { debug } from '@ember/debug';

const { authEndpoint, apiEndpoint } = config;

// Collects the list of includes from all requests
// and ensures the future fetches don't override previously loaded includes
let includes = ['owner.installation', 'user.emails'];

const afterSignOutCallbacks = A([]);

const STATE = {
  SIGNED_OUT: 'signed-out',
  SIGNED_IN: 'signed-in',
  SIGNING_IN: 'signing-in'
};

const USER_FIELDS = ['id', 'login', 'token', 'rss_token', 'correct_scopes', 'channels', 'vcs_type', 'confirmed_at'];

const TOKEN_EXPIRED_MSG = "You've been signed out, because your access token has expired.";

export default Service.extend({
  api: service(),
  router: service(),
  flashes: service(),
  intercom: service(),
  store: service(),
  localStorage: service('storage'),
  sessionStorage: service(),
  features: service(),
  metrics: service(),
  utm: service(),
  permissionsService: service('permissions'),
  wizardStateService: service('wizard-state'),

  state: STATE.SIGNED_OUT,

  signedIn: equal('state', STATE.SIGNED_IN),
  signedOut: equal('state', STATE.SIGNED_OUT),
  signingIn: equal('state', STATE.SIGNING_IN),

  isProVersion: reads('features.proVersion'),

  storage: reads('localStorage.auth'),

  accounts: reads('storage.accounts'),

  inactiveAccounts: computed('accounts.@each.id', 'storage.activeAccount.id', function () {
    const { accounts, activeAccount } = this.storage;
    if (accounts.content() && accounts.content().length > 0 && activeAccount) {
      return accounts.content().filter(account => account.id !== activeAccount.id);
    } else {
      return [];
    }
  }),

  currentUser: reads('storage.activeAccount'),

  permissions: reads('currentUser.permissions'),

  token: or('currentUser.authToken', 'storage.token'),
  assetToken: reads('currentUser.token'),
  rssToken: reads('currentUser.rssToken'),

  userName: reads('currentUser.fullName'),
  gravatarUrl: reads('currentUser.gravatarUrl'),

  redirectUrl: null,

  init() {
    this._super(...arguments);
    window.addEventListener('focus', () => this.checkAuth());
  },

  checkAuth() {
    if (!this.currentUser || !this.storage)
      return;
    const { accounts } = this.storage;
    const { vcsId } = this.currentUser;
    const stillLoggedIn = accounts.content().isAny('vcsId', vcsId);

    if (!stillLoggedIn) {
      this.router.transitionTo('signin');
    }
  },

  switchAccount(id, redirectUrl) {
    if (!this.store.isDestroyed && !this.store.isDestroying)
      this.store.unloadAll();
    const targetAccount = this.accounts.findBy('id', id);
    this.storage.set('activeAccount', targetAccount);
    if (redirectUrl)
      window.location.href = redirectUrl;
    else
      window.location.reload();
  },

  signOut(runTeardown = true) {
    if (this.signedIn) this.api.get('/logout');

    [this.localStorage, this.sessionStorage].forEach(storage => {
      storage.clearPreferencesData();
    });

    this.set('state', STATE.SIGNED_OUT);

    const { accounts, activeAccount } = this.storage;
    accounts.removeObject(activeAccount);
    this.storage.setProperties({ accounts, activeAccount: null });

    if (runTeardown) {
      this.clearNonAuthFlashes();
      runAfterSignOutCallbacks();
    }
    if (!this.store.isDestroyed && !this.store.isDestroying)
      this.store.unloadAll();

    const { currentRouteName } = this.router;
    if (currentRouteName && currentRouteName !== 'signin') {
      try {
        this.router.transitionTo('signin');
      } catch (e) {}
    }
  },

  afterSignOut(callback) {
    afterSignOutCallbacks.push(callback);
  },

  signInWith(provider) {
    assert(`Invalid provider to authenticate ${provider}`, availableProviders.includes(provider));
    this.signIn(provider);
  },

  signUp(provider) {
    this.set('state', STATE.SIGNING_IN);
    const url = new URL(this.redirectUrl || window.location.href);

    if (['/signin', '/plans', '/integration/bitbucket'].includes(url.pathname)) {
      url.pathname = '/';
    }
    const providerSegment = provider ? `/${provider}` : '';
    const path = `/auth/handshake${providerSegment}`;
    window.location.href = `${authEndpoint || apiEndpoint}${path}?signup=true&redirect_uri=${url}`;
  },

  signIn(provider) {
    this.set('state', STATE.SIGNING_IN);

    const url = new URL(this.redirectUrl || window.location.href);

    if (['/signin', '/plans', '/integration/bitbucket'].includes(url.pathname)) {
      url.pathname = '/';
    }
    const providerSegment = provider ? `/${provider}` : '';
    const path = `/auth/handshake${providerSegment.replace('-', '')}`;
    window.location.href = `${authEndpoint || apiEndpoint}${path}?redirect_uri=${url}`;
  },

  getAccountByProvider(provider) {
    const { vcsTypes } = vcsConfigByUrlPrefixOrType(provider);
    const [,, userType] = vcsTypes;
    return this.accounts.findBy('vcsType', userType);
  },

  isSignedInWith(provider) {
    return !!this.getAccountByProvider(provider);
  },

  autoSignIn() {
    this.set('state', STATE.SIGNING_IN);

    try {
      const promise = this.storage.user ? this.handleNewLogin() : this.reloadCurrentUser();
      return promise
        .then(() => {  this.permissionsService.fetchPermissions.perform()})
        .then(() => {
            const {currentUser} = this;
            this.set('state', STATE.SIGNED_IN);
            Travis.trigger('user:signed_in', currentUser);
            Travis.trigger('user:refreshed', currentUser);
        })
        .catch(error => {
          console.log("Problems");
          console.log(error.message);
          if (!didCancel(error)) {
            throw new Error(error);
          }
        });
    } catch (error) {
      console.log("General catch");
      console.log(error.message); // for debugging purposes is better option...
      console.log(error.stack);
      this.signOut(false);
    }
  },

  handleNewLogin() {
    const { storage } = this;
    const { user, token, isBecome } = storage;

    storage.clearLoginData();

    if (!user || !token) throw new Error('No login data');
    const userData = getProperties(user, USER_FIELDS);
    const installationData = getProperties(user, ['installation']);
    if (installationData && installationData.installation) {
      storage.set('activeAccountInstallation', installationData.installation);
    }
    this.validateUserData(userData, isBecome);
    const userRecord = pushUserToStore(this.store, userData);
    userRecord.set('authToken', token);

    return this.reloadUser(userRecord).then(() => {
        storage.accounts.push(userRecord);
        storage.set('activeAccount', userRecord);
        this.reportNewUser();
        this.reportToIntercom();
    });
  },

  reloadCurrentUser(include = []) {
    if (!this.currentUser) throw new Error('No active account');
    return this.reloadUser(this.currentUser, include);
  },

  reloadUser(userRecord, include = []) {
    includes = includes.concat(include).uniq();
    return this.fetchUser.perform(userRecord);
  },

  fetchUser: task(function* (userRecord) {
    try {
      const reloadedUser = userRecord.reload({ included: includes.join(',') });
      return yield reloadedUser;
    } catch (error) {
      const status = +error.status || +get(error, 'errors.firstObject.status');
      this.flashes.error(TOKEN_EXPIRED_MSG);
      yield this.signOut();
    }
  }).keepLatest(),

  validateUserData(user, isBecome) {
    const hasChannelsOnPro = field => field === 'channels' && !this.isProVersion;
    user['confirmed_at'] = user['confirmed_at'] || false;
    const hasAllFields = USER_FIELDS.every(field => isPresent(user[field]) || hasChannelsOnPro(field));
    const hasCorrectScopes = user.correct_scopes || isBecome;
    if (!hasAllFields || !hasCorrectScopes) {
      throw new Error('User validation failed');
    }
  },

  reportToIntercom() {
    const {
      id,
      name,
      emails,
      email: userEmail,
      firstLoggedInAt: createdAt,
      secureUserHash: userHash,
      vcsProvider = {}
    } = this.currentUser;
    const email = userEmail || emails && emails.firstObject;
    this.intercom.set('user', { id, name, email, createdAt, userHash, provider: vcsProvider.name });
  },

  reportNewUser() {
    const { currentUser, metrics } = this;
    const { recentlySignedUp, vcsProvider } = currentUser;

    if (recentlySignedUp) {
      metrics.trackEvent({
        event: 'first_authentication'
      });
      if (vcsProvider) {
        metrics.trackEvent({
          event: 'first_authentication_with_provider',
          authProvider: vcsProvider.name
        });
      }
      if (this.utm.hasData) {
        currentUser.set('utmParams', this.utm.all);
        currentUser.save();
      }
    }
  },

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
      if (this.storage.get('activeAccountInstallation')) {
        let installation = this.storage.get('activeAccountInstallation');
        if (installation) {
          return this.router.transitionTo('github_apps_installation');
        }
      }
      return this.router.transitionTo('first_sync');
    }
  }),

  actions: {

    switchAccount(id) {
      this.switchAccount(id);
    },

    signIn(runAfterSignIn) {
      let applicationRoute = getOwner(this).lookup('route:application');
      applicationRoute.send('signIn', runAfterSignIn);
    },

    signOut() {
      this.signOut();
    }
  }
});

function pushUserToStore(store, user) {
  let theUser = store.normalize('user', user);
  const record = store.push(theUser);
  const installation = store.peekAll('installation').findBy('owner.id', user.id) || null;
  record.setProperties({ installation });
  return record;
}

function runAfterSignOutCallbacks() {
  afterSignOutCallbacks.forEach(callback => callback());
  afterSignOutCallbacks.clear();
}
