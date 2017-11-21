/* global Travis, HS */
import $ from 'jquery';

import { inject as service } from '@ember/service';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import BuildFaviconMixin from 'travis/mixins/build-favicon';

import KeyboardShortcuts from 'ember-keyboard-shortcuts/mixins/route';

export default TravisRoute.extend(BuildFaviconMixin, KeyboardShortcuts, {
  flashes: service(),
  auth: service(),
  featureFlags: service(),
  repositories: service(),

  needsAuth: false,

  init() {
    this.get('auth').afterSignOut(() => {
      this.afterSignOut();
    });
    return this._super(...arguments);
  },

  renderTemplate: function () {
    if (this.get('config').pro) {
      $('body').addClass('pro');
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
  },

  // We send pusher updates through user channels now and this means that if a
  // user is not a collaborator of a repo or a user is not signed in, we need to
  // use repo channels for updates for each repo. This method ensures that a
  // visitor is subscribed to all of the public repos in the store as long as
  // they're not a collaborator. It also sets up an observer to subscribe to any
  // new repo that enters the store.
  setupRepoSubscriptions() {
    this.get('store').filter('repo', null,
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
    if (this.pusher) {
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
    signIn() {
      this.get('auth').signIn();
      this.afterSignIn();
    },

    signOut() {
      this.get('auth').signOut();
    },

    disableTailing() {
      Travis.tailing.stop();
    },

    redirectToGettingStarted() {
      // keep as a no-op as this bubbles from other routes
    },

    error(error) {
      if (error === 'needs-auth') {
        this.set('auth.redirected', true);
        return this.transitionTo('auth');
      } else {
        return true;
      }
    },

    showRepositories() {
      this.transitionTo('index');
    },

    viewSearchResults(query) {
      this.transitionTo('search', query);
    },

    helpscoutTrigger() {
      HS.beacon.open();
      return false;
    }
  },

  afterSignIn() {
    this.get('flashes').clear();
    let transition = this.auth.get('afterSignInTransition');
    if (transition) {
      this.auth.set('afterSignInTransition', null);
      return transition.retry();
    } else {
      return this.transitionTo('index');
    }
  },

  afterSignOut() {
    this.get('featureFlags').reset();
    this.set('repositories.accessible', []);
    this.setDefault();
    if (this.get('config.enterprise')) {
      return this.transitionTo('auth');
    }
    return this.transitionTo('index');
  },
});
