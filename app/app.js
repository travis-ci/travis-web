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

var App = Ember.Application.extend(Ember.Evented, {
  LOG_TRANSITIONS: true,
  LOG_TRANSITIONS_INTERNAL: true,
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver,

  toggleSidebar() {
    var element;
    $('body').toggleClass('maximized');
    element = $('<span></span>');
    $('#top .profile').append(element);
    Ember.run.later((function() {
      return element.remove();
    }), 10);
    element = $('<span></span>');
    $('#repo').append(element);
    return Ember.run.later((function() {
      return element.remove();
    }), 10);
  },

  ready() {
    if (location.hash.slice(0, 2) === '#!') {
      location.href = location.href.replace('#!/', '');
    }
    
    this.on('user:signed_in', function(user) {
      return Travis.onUserUpdate(user);
    });
    this.on('user:refreshed', function(user) {
      return Travis.onUserUpdate(user);
    });
    this.on('user:synced', function(user) {
      return Travis.onUserUpdate(user);
    });
    return this.on('user:signed_out', function() {
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
    HS.beacon.ready(function() {
      return HS.beacon.destroy();
    });
  },

  setupBeacon() {

    if (window.HS) {
      HS.beacon.ready(function() {
        HS.beacon.init();
      });  
    } else {
      initHsBeacon();
    }
  },

  subscribePusher(user) {
    var channels;
    if (!user.channels) {
      return;
    }
    channels = user.channels;
    if (config.pro) {
      channels = channels.map(function(channel) {
        if (channel.match(/^private-/)) {
          return channel;
        } else {
          return "private-" + channel;
        }
      });
    }
    return Travis.pusher.subscribeAll(channels);
  },

  identifyHSBeacon(user) {
    if (HS && HS.beacon) {
      HS.beacon.ready(function() {
        return HS.beacon.identify({
          name: user.name,
          email: user.email,
          login: user.login,
          last_synced_at: user.synced_at
        });
      });
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
