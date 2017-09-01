/* global Travis, HS */
import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import initHsBeacon from 'travis/utils/init-hs-beacon';

// This can be set per environment in config/environment.js
const debuggingEnabled = config.featureFlags['debug-logging'];
const proVersion = config.featureFlags['pro-version'];

const App = Ember.Application.extend(Ember.Evented, {
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  // Configure global logging based on debug feature flag
  LOG_TRANSITIONS: debuggingEnabled,
  LOG_TRANSITIONS_INTERNAL: debuggingEnabled,
  LOG_ACTIVE_GENERATION: debuggingEnabled,
  LOG_MODULE_RESOLVER: debuggingEnabled,
  LOG_VIEW_LOOKUPS: debuggingEnabled,

  ready() {
    this.on('user:signed_in', (user) => Travis.onUserUpdate(user));
    this.on('user:refreshed', (user) => Travis.onUserUpdate(user));
    this.on('user:synced', (user) => Travis.onUserUpdate(user));
  },

  currentDate() {
    return new Date();
  },

  onUserUpdate(user) {
    if (proVersion && config.beacon) {
      this.setupBeacon();
      this.identifyHSBeacon(user);
    }
    return this.subscribePusher(user);
  },

  setupBeacon() {
    if (!window.HS) {
      initHsBeacon();
    }
  },

  subscribePusher(user) {
    if (!user.channels) {
      return;
    }
    Travis.pusher.subscribeAll(user.channels);
  },

  identifyHSBeacon(user) {
    if (HS && HS.beacon) {
      HS.beacon.ready(() => {
        const { name, email, login, synced_at } = user;
        const userParams = {
          name,
          email,
          login,
          last_synced_at: synced_at,
        };
        return HS.beacon.identify(userParams);
      });
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
