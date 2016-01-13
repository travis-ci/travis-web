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
        auth: this.container.lookup('service:auth')
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
    this._super.apply(this, arguments);
    if (config.gaCode) {
      return _gaq.push(['_trackPageview', location.pathname]);
    }
  }
});

Router.map(function() {
  this.resource('dashboard', function() {
    this.route('repositories', { path: '/' });
  });
  this.resource('main', { path: '/' }, function() {
    this.resource('getting_started');
    this.route('recent');
    this.route('repositories');
    this.route('my_repositories');
    this.route('search', { path: '/search/:phrase' });
    this.resource('repo', { path: '/:owner/:name' }, function() {
      this.route('index', { path: '/' });
      this.resource('branches', { path: '/branches' });
      this.resource('build', { path: '/builds/:build_id' });
      this.resource('job', { path: '/jobs/:job_id' });
      this.resource('builds', { path: '/builds' });
      this.resource('pullRequests', { path: '/pull_requests' });
      this.resource('requests', { path: '/requests' });
      if (config.endpoints.caches) {
        this.resource('caches', { path: '/caches' });
      }
      this.resource('request', { path: '/requests/:request_id' });
      this.resource('settings', function() {
        this.route('index', { path: '/' });
        this.resource('env_vars', function() {
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
  this.resource('profile', { path: '/profile' }, function() {
    this.resource('accounts', { path: '/' }, function() {
      this.resource('account', { path: '/:login' });
      this.route('info', { path: '/info' });
    });
  });
  this.resource('owner', { path: '/:owner' }, function() {
    this.route('repositories', { path: '/' });
  });
  this.route('error404', { path: '/404' });
});

export default Router;
