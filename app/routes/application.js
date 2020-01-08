/* global Travis */
import URL from 'url';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';
import {
  bindKeyboardShortcuts,
  unbindKeyboardShortcuts
} from 'ember-keyboard-shortcuts';
import { isFastboot } from 'travis/utils/fastboot';

export default TravisRoute.extend({
  auth: service(),
  features: service(),
  featureFlags: service(),
  flashes: service(),
  metrics: service(),
  repositories: service(),
  router: service(),
  fastboot: service(),

  needsAuth: false,

  init() {
    this.featureFlags;
    this.auth.autoSignIn();

    this.auth.afterSignOut(() => {
      this.afterSignOut();
    });

    if (config.metricsAdapters.length > 0) {
      const { metrics, router } = this;
      router.on('routeDidChange', () => {
        try {
          const { currentURL: page } = router;
          metrics.trackPage({ page });
        } catch (err) {
        }
      });
    }

    return this._super(...arguments);
  },

  model() {
    if (this.get('auth.signedIn')) {
      return this.get('featureFlags.fetchTask').perform();
    }
  },

  activate() {
    this.setupRepoSubscriptions();
    if (!isFastboot) bindKeyboardShortcuts(this);
  },

  deactivate() {
    if (!isFastboot) unbindKeyboardShortcuts(this);
  },

  // We send pusher updates through user channels now and this means that if a
  // user is not a collaborator of a repo or a user is not signed in, we need to
  // use repo channels for updates for each repo. This method ensures that a
  // visitor is subscribed to all of the public repos in the store as long as
  // they're not a collaborator. It also sets up an observer to subscribe to any
  // new repo that enters the store.
  setupRepoSubscriptions() {
    this.store.filter('repo', null,
      (repo) => !repo.get('private') && !repo.get('isCurrentUserACollaborator'),
      ['private', 'isCurrentUserACollaborator']
    ).then((repos) => {
      repos.forEach(repo => this.subscribeToRepo(repo));
      repos.addArrayObserver(this, {
        willChange: 'reposWillChange',
        didChange: 'reposDidChange'
      });
    });
  },

  reposWillChange(array, start, removedCount, addedCount) {
    let removedRepos = array.slice(start, start + removedCount);
    return removedRepos.forEach(repo => this.unsubscribeFromRepo(repo));
  },

  reposDidChange(array, start, removedCount, addedCount) {
    let addedRepos = array.slice(start, start + addedCount);
    return addedRepos.forEach(repo => this.subscribeToRepo(repo));
  },

  unsubscribeFromRepo: function (repo) {
    if (this.pusher && repo) {
      this.pusher.unsubscribe(`repo-${repo.get('id')}`);
    }
  },

  subscribeToRepo: function (repo) {
    if (this.pusher) {
      this.pusher.subscribe(`repo-${repo.get('id')}`);
    }
  },

  title(titleParts) {
    if (titleParts.length) {
      titleParts = titleParts.reverse();
      titleParts.push('Travis CI');
      return titleParts.join(' - ');
    } else {
      return config.defaultTitle;
    }
  },

  keyboardShortcuts: {
    'up': {
      action: 'disableTailing',
      preventDefault: false
    },
    'down': {
      action: 'disableTailing',
      preventDefault: false
    }
  },

  actions: {
    signIn(runAfterSignIn = true) {
      this.auth.signIn();
      if (runAfterSignIn) {
        this.afterSignIn();
      }
    },

    signOut() {
      this.auth.signOut();
    },

    disableTailing() {
      Travis.tailing.stop();
    },

    redirectToGettingStarted() {
      // keep as a no-op as this bubbles from other routes
    },

    error(error) {
      if (error === 'needs-auth') {
        let url = '';
        if (isFastboot) {
          const { protocol, host, path } = this.fastboot.request;
          url = `${protocol}//${host}${path}`;
        } else {
          url = window.location.href;
        }
        const currentURL = new URL(url);
        const redirectUri = currentURL.href;
        const queryParams = { redirectUri };
        return this.transitionTo('auth', { queryParams });
      } else {
        return true;
      }
    },
  },

  afterSignIn() {
    this.flashes.clear();
    let transition = this.get('auth.afterSignInTransition');
    if (transition) {
      this.set('auth.afterSignInTransition', null);
      return transition.retry();
    } else {
      return this.transitionTo('index');
    }
  },

  afterSignOut() {
    try {
      this.featureFlags.reset();
      this.set('repositories.accessible', []);
      this.setDefault();
      if (this.get('features.enterpriseVersion')) {
        return this.transitionTo('auth');
      }
      return this.transitionTo('index');
    } catch (error) {}
  },
});
