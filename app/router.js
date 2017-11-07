/* global _gaq */
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,

  didTransition() {
    this._super(...arguments);
    if (config.gaCode) {
      _gaq.push(['_trackPageview', location.pathname]);
    }
  }
});

Router.map(function () {
  this.route('dashboard', { resetNamespace: true }, function () {
    this.route('repositories', { path: '/' });
  });
  this.route('features', { resetNamespace: true });

  this.route('getting_started');

  this.route('repo', { path: '/:owner/:name' }, function () {
    this.route('index', { path: '/' });
    this.route('branches', { path: '/branches', resetNamespace: true });
    this.route('build', { path: '/builds/:build_id', resetNamespace: true }, function () {
      this.route('config');
    });
    this.route('job', { path: '/jobs/:job_id', resetNamespace: true }, function () {
      this.route('config');
    });
    this.route('builds', { path: '/builds', resetNamespace: true });
    this.route('pullRequests', { path: '/pull_requests', resetNamespace: true });
    this.route('requests', { path: '/requests', resetNamespace: true });
    if (config.endpoints.caches) {
      this.route('caches', { path: '/caches', resetNamespace: true });
    }
    this.route('settings', { resetNamespace: true }, function () {
      this.route('index', { path: '/' });
    });
  });

  this.route('search', { path: '/search/:phrase' });

  this.route('first_sync');
  this.route('insufficient_oauth_permissions');
  this.route('auth');
  this.route('signup');
  this.route('plans', { path: '/plans' });
  this.route('team', { path: '/about' });
  this.route('logo', { path: '/logo' });
  this.route('profile', { path: '/profile', resetNamespace: true }, function () {
    this.route('accounts', { path: '/', resetNamespace: true }, function () {
      this.route('account', { path: '/:login', resetNamespace: true }, function () {
        this.route('repositories', { path: '/' });
      });
    });
  });
  this.route('owner', { path: '/:owner', resetNamespace: true }, function () {
    this.route('repositories', { path: '/' });
  });
  this.route('error404', { path: '/404' });
  this.route('page-not-found', { path: '/*wildcard' });
});

export default Router;
