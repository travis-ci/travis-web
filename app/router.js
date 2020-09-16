import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

Router.map(function () {
  this.route('dashboard', { resetNamespace: true }, function () {
    this.route('repositories', { path: '/' });
    this.route('builds', { path: '/builds' });
  });
  this.route('features-tracing', { path: '/features/tracing', resetNamespace: true });

  this.route('getting_started');

  this.route('search', { path: '/search/:phrase' });

  this.route('first_sync');
  this.route('insufficient_oauth_permissions');
  this.route('signin');
  this.route('signup');
  this.route('github_apps_installation', { path: '/settings/github-apps-installations/redirect' });
  this.route('plans', { path: '/plans' }, function () {
    this.route('index', { path: '/' });
    this.route('thank-you');
  });
  this.route('team', { path: '/about' });
  this.route('logo', { path: '/logo' });
  this.route('help');
  this.route('integration', function () {
    this.route('bitbucket');
  });

  this.route('account', function () {
    this.route('repositories');
    this.route('settings', { path: '/preferences' });
    this.route('billing', { path: '/subscription' });
    this.route('migrate');
  });
  this.route('organization', { path: '/organizations/:login' }, function () {
    this.route('repositories');
    this.route('settings', { path: '/preferences' });
    this.route('billing', { path: '/subscription' });
    this.route('migrate');
  });
  this.route('unsubscribe', { path: '/account/preferences/unsubscribe' });
  this.route('profile', { path: '/profile/:login' });
  this.route('profile', { path: '/profile/:login/:section' });

  this.route('travisci-vs-jenkins', function () {
    this.route('index', { path: '/' });
    this.route('thank-you');
  });

  this.route('repo', { path: '/:provider/:owner/:name' }, function () {
    this.route('index', { path: '/' });
    this.route('branches', { path: '/branches', resetNamespace: true });
    this.route('builds', { path: '/builds', resetNamespace: true });
    this.route('build', { path: '/builds/:build_id', resetNamespace: true }, function () {
      this.route('config');
    });
    this.route('config');
    this.route('job', { path: '/jobs/:job_id', resetNamespace: true }, function () {
      this.route('config');
    });
    this.route('pullRequests', { path: '/pull_requests', resetNamespace: true });
    this.route('requests', { path: '/requests', resetNamespace: true });
    if (config.endpoints.caches) {
      this.route('caches', { path: '/caches', resetNamespace: true });
    }
    this.route('settings', { resetNamespace: true });
  });

  this.route('owner', { path: '/:provider/:owner', resetNamespace: true }, function () {
    this.route('repositories', { path: '/' });
  });

  this.route('provider', { path: '/:provider' });

  this.route('legacy-repo-url', { path: '/:owner' });
  this.route('legacy-repo-url', { path: '/:owner/:repo' });
  this.route('legacy-repo-url', { path: '/:owner/:repo/:method' });
  this.route('legacy-repo-url', { path: '/:owner/:repo/:method/:id' });
  this.route('legacy-repo-url', { path: '/:owner/:repo/:method/:id/:view' });

  this.route('error404', { path: '/404' });
  this.route('page-not-found', { path: '/*wildcard' });
});

export default Router;
