/* global Travis, _cio */
import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
/* globals HS */
import initHsBeacon from 'travis/utils/init-hs-beacon';

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.LinkComponent.reopen({
  attributeBindings: ['alt']
});

const App = Ember.Application.extend(Ember.Evented, {
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,

  ready() {
    if (location.hash.slice(0, 2) === '#!') {
      location.href = location.href.replace('#!/', '');
    }

    this.on('user:signed_in', user => Travis.onUserUpdate(user));
    this.on('user:refreshed', user => Travis.onUserUpdate(user));
    this.on('user:synced', user => Travis.onUserUpdate(user));
    return this.on('user:signed_out', () => {
      if (config.beacon) {
        return Travis.destroyBeacon();
      }
    });
  },

  currentDate() {
    return new Date();
  },

  onUserUpdate(user) {
    if (config.pro) {
      this.identifyCustomer(user);
    }
    if (config.pro && config.beacon) {
      this.setupBeacon();
      this.identifyHSBeacon(user);
    }
    return this.subscribePusher(user);
  },

  destroyBeacon() {
    HS.beacon.ready(() => HS.beacon.destroy());
  },

  setupBeacon() {
    if (!window.HS) {
      initHsBeacon();
    }
  },

  subscribePusher(user) {
    let channels;
    if (!user.channels) {
      return;
    }
    channels = user.channels;
    if (config.pro) {
      channels = channels.map(channel => {
        if (channel.match(/^private-/)) {
          return channel;
        } else {
          return `private-${channel}`;
        }
      });
    }
    return Travis.pusher.subscribeAll(channels);
  },

  identifyHSBeacon(user) {
    if (HS && HS.beacon) {
      HS.beacon.ready(() => HS.beacon.identify({
        name: user.name,
        email: user.email,
        login: user.login,
        last_synced_at: user.synced_at
      }));
    }
  },

  identifyCustomer(user) {
    if (_cio && _cio.identify) {
      return _cio.identify({
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: (Date.parse(user.created_at) / 1000) || null,
        login: user.login
      });
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
