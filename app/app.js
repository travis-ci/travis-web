import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

Ember.MODEL_FACTORY_INJECTIONS = true;

Ember.LinkComponent.reopen({
  attributeBindings: ['alt']
});

var App = Ember.Application.extend(Ember.Evented, {
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
      if (config.userlike) {
        return Travis.removeUserlike();
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
    if (config.userlike) {
      this.setupUserlike(user);
    }
    return this.subscribePusher(user);
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

  setupUserlike(user) {
    var btn, s, userlikeData;
    btn = document.getElementById('userlikeCustomTab');
    btn.classList.add("logged-in");
    userlikeData = window.userlikeData = {};
    userlikeData.user = {};
    userlikeData.user.name = user.login;
    userlikeData.user.email = user.email;
    if (!document.getElementById('userlike-script')) {
      s = document.createElement('script');
      s.id = 'userlike-script';
      s.src = '//userlike-cdn-widgets.s3-eu-west-1.amazonaws.com/0327dbb23382ccbbb91b445b76e8a91d4b37d90ef9f2faf84e11177847ff7bb9.js';
      return document.body.appendChild(s);
    }
  },

  removeUserlike() {
    var btn;
    btn = document.getElementById('userlikeCustomTab');
    return btn.classList.remove("logged-in");
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
