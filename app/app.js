/* global Travis */
import Evented from '@ember/object/evented';

import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

// This can be set per environment in config/environment.js
const debuggingEnabled = config.featureFlags['debug-logging'];

const App = Application.extend(Evented, {
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
    return this.subscribePusher(user);
  },

  subscribePusher(user) {
    if (!user || !user.channels) {
      return;
    }
    Travis.pusher.subscribeAll(user.channels);
  }

});

loadInitializers(App, config.modulePrefix);

export default App;
