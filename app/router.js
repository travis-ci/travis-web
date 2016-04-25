import Ember from 'ember';
import config from './config/environment';
import Location from 'travis/utils/location';

var Router = Ember.Router.extend({
  location: function() {
    if (Ember.testing) {
      return 'none';
    } else {
      // this is needed, because in the location
      // we need to decide if repositories or home needs
      // to be displayed, based on the current login status
      //
      // we should probably think about a more general way to
      // do this, location should not know about auth status
      return Location.create({
        auth: Ember.getOwner(this).lookup('service:auth')
      });
    }
  }.property(),

  generate() {
    var url;
    url = this.router.generate.apply(this.router, arguments);
    return this.get('location').formatURL(url);
  },

  handleURL(url) {
    url = url.replace(/#.*?$/, '');
    return this._super(url);
  },

  didTransition() {
    this._super(...arguments);
    if (config.gaCode) {
      _gaq.push(['_trackPageview', location.pathname]);
    }
  }
});

Router.map(function() {
  this.route('dashboard', { resetNamespace: true }, function() {
    this.route('repositories', { path: '/' });
  });
  this.route('main', { path: '/', resetNamespace: true }, function() {
    this.route('getting_started', { resetNamespace: true });
    this.route('recent');
    this.route('repositories');
    this.route('my_repositories');
    this.route('search', { path: '/search/:phrase' });
    this.route('repo', { path: '/:owner/:name', resetNamespace: true }, function() {
      this.route('index', { path: '/' });
      this.route('branches', { path: '/branches', resetNamespace: true });
      this.route('build', { path: '/builds/:build_id', resetNamespace: true });
      this.route('job', { path: '/jobs/:job_id', resetNamespace: true });
      this.route('builds', { path: '/builds', resetNamespace: true });
      this.route('pullRequests', { path: '/pull_requests', resetNamespace: true });
      this.route('crons', { path: '/crons', resetNamespace: true });
      this.route('requests', { path: '/requests', resetNamespace: true });
      if (config.endpoints.caches) {
        this.resource('caches', { path: '/caches' });
      }
      this.route('request', { path: '/requests/:request_id', resetNamespace: true });
      this.route('settings', { resetNamespace: true }, function() {
        this.route('index', { path: '/' });
        this.route('env_vars', { resetNamespace: true }, function() {
          this.route('new');
        });
        if (config.endpoints.sshKey) {
          this.resource('ssh_key');
        }
      });
    });
  });

  this.route('first_sync');
  this.route('insufficient_oauth_permissions');
  this.route('signin');
  this.route('auth');
  this.route('home');
  this.route('home-pro', { path: '/home-pro' });
  this.route('plans', { path: '/plans' });
  this.route('team', { path: '/about' });
  this.route('logo', { path: '/logo' });
  this.route('profile', { path: '/profile', resetNamespace: true }, function() {
    this.route('accounts', { path: '/', resetNamespace: true }, function() {
      this.route('account', { path: '/:login', resetNamespace: true });
      this.route('info', { path: '/info' });
    });
  });
  this.route('owner', { path: '/:owner', resetNamespace: true }, function() {
    this.route('repositories', { path: '/' });
  });
  this.route('error404', { path: '/404' });
});

export default Router;
